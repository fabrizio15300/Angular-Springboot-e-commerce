import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;

  shippingAddressStates:State[]=[];
  billingAddressStates:State[]=[];


  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  countries: Country[]=[];

  constructor(private formBuilder: FormBuilder,
              private luv2ShopFormService: Luv2ShopFormService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router) { }

  ngOnInit(): void {


    this.rewiewCartDetails();



    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: [''],
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      creditCard: this.formBuilder.group({
        cartType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
      }),
    });

    //popolo i mesi della carta di credito
    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved Months: " + JSON.stringify(data));
        this.creditCardMonths = data;

      }
    )

    //popolo gli anni della carta di credito
    this.luv2ShopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved Years: " + JSON.stringify(data));
        this.creditCardYears = data;

      }
    )

      //popolo countries
      this.luv2ShopFormService.getCountries().subscribe(
        data =>{
          console.log("retrivied countries: " + JSON.stringify(data))
          this.countries=data;
        }
      );


  }//ngONiNIT

  rewiewCartDetails() {

    //iscrivermi al CartService.totalQuantity e totalPrice

    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    )

    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    )


  }

  onSubmit() {
    console.log("Handling the submit button");

    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    //set up order
    let order= new Order();
    order.totalPrice=this.totalPrice;
    this.totalQuantity=this.totalQuantity;
    
    //ricevere i cart item
    const cartItems=this.cartService.cartItems;

    //creare orderItem per cartItem 
       let orderItems : OrderItem[]=[];
       for(let i=0; i<cartItems.length; i++){
        orderItems[i]=new OrderItem(cartItems[i]);
       }

    //buildare purchase
    let purchase= new Purchase();

    //popolare purchase-customer
    purchase.customer=this.checkoutFormGroup.controls['customer'].value;
    

    // popolare purchase con shipping e billing
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState:State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));  
    const shippingCountry:Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState:State = JSON.parse(JSON.stringify(purchase.billingAddress.state));  
    const billingCountry:Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    // popolare purchase  con order e orderItem
    purchase.order=order;
    purchase.orderItems=orderItems;
    
    //chiamo le Rest API tramite checkout service
    this.checkoutService.placeOrder(purchase).subscribe(
      {
          next: response=>{
            alert(`your order has been recived \nOrder tracking Number: ${response.orderTrackingNumber} `);

            //resetto il carrello
            this.resetCart();
          },
          error: err =>{
            alert(`There was a n error: ${err.message} `);

          }
      }
    );
    
  }
  resetCart() {
    //resetto i data, form e ritorno ai prodotti

    //data
    this.cartService.cartItems=[];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    //form
    this.checkoutFormGroup.reset();

    //ritorno ai prodotti tramite router
    this.router.navigateByUrl("/products");

    
  }//ResetCart


  copyShippingAddressToBillingAddress(event: Event): void {
    const target = event.target as HTMLInputElement;

    if (target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }
  }

  //gestisco la visualizzazione dei mesi in base all'anno selezionato
  handleMonthsAndYears(){

    const creditCardFormGroup= this.checkoutFormGroup.get('creditCard');
    const currentYear: number =new Date().getFullYear();
    const selectedYear: number= Number(creditCardFormGroup?.value.expirationYear);
    //se l'anno corrente e quello selezionato si equivalgono allora

    let startMonth: number;
    if(currentYear=== selectedYear){
      startMonth=new Date().getMonth()+1;
    }
    else{
      startMonth=1;
    }
      this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
        data=>{
          console.log("retrived credit card months: " +JSON.stringify(data));
          this.creditCardMonths=data;
        }
      )
  }


  getStates(formGroupName:string){
    const formGroup=this.checkoutFormGroup.get(formGroupName);

    const countryCode=formGroup!.value.country.code;
    const countryName=formGroup!.value.country.name;

    console.log(`{formGroupName} country code:${countryCode}`);
    console.log(`{formGroupName} country name:${countryName}`);

    this.luv2ShopFormService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress'){
          this.shippingAddressStates = data;
        }
        else {
          this.billingAddressStates = data;
        }
        //select first item by default

        formGroup!.get('state')?.setValue(data[0]);
      }
    );

    

  }

}//CheckoutComponent
