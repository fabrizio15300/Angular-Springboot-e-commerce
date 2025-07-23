import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
 

  cartItems: CartItem[]=[];

  //Subject è una sottoclasse d observable
  //posso usare subject per publicare gli eventi a tutti i subscriber

  totalPrice: Subject<number>= new BehaviorSubject<number>(0);
  totalQuantity: Subject<number>= new BehaviorSubject<number>(0);

  //storage:Storage = sessionStorage;
  storage: Storage = localStorage; //i dati sopravvivono al restart del browser

  constructor() { 

    //read data form storage
    let rawData = this.storage.getItem('cartItems');
    let data = rawData ? JSON.parse(rawData) : [];


    if (Array.isArray(data)) {
      this.cartItems = data;
    } else {
      console.warn('I dati recuperati non sono un array. Inizializzo il carrello come vuoto.');
      this.cartItems = [];
    }
    

        
  }//constructor


  addToCart(theCartItem: CartItem){
    //verifico se il prodotto è già nel carrello, tramite id e vedo se lo trovo

    let alreadyExistsInCart: boolean=false;
    let existingCartItem: CartItem | undefined = undefined;

    if(this.cartItems.length>0){

    existingCartItem=this.cartItems.find(tempCartItem=> tempCartItem.id===theCartItem.id);
      



    alreadyExistsInCart=(existingCartItem!=undefined);   
}
    
if(alreadyExistsInCart){
  existingCartItem!.quantity++;
}
  else{
    this.cartItems.push(theCartItem);
  }

  this.computeCartTotals();


  }//addToCart

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;
    if(theCartItem.quantity==0){
      this.remove(theCartItem);
    }
    else{
      this.computeCartTotals();
    }
  }//decrement quantity
  
  remove(theCartItem: CartItem) {
    //devo prendere l'indice di dove si trova nell'array
    const itemIndex= this.cartItems.findIndex(
      tempCartItem=> tempCartItem.id==theCartItem.id
    );

    //se l'oggetto esiste allora il valore di index sarà >1

    if(itemIndex > -1){
      this.cartItems.splice(itemIndex,1); //rimuovi 1 volta quel prodotto
    
      this.computeCartTotals();
    }

  }//remove
  
  computeCartTotals() {
    let totalPriceValue:number =0;
    let totalQuantityValue:number=0;

    for(let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.quantity*currentCartItem.unit_price;
      totalQuantityValue += currentCartItem.quantity;
    }
    //informare dei nuovi valori, next publica/lancia l'evento a tutti i subscribers
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    //log cart data per debuggare
    this.logCartData(totalPriceValue,totalQuantityValue);

    //persist the cart data
    this.persistCartItems();
    
  }

  persistCartItems(){
    //prendo il valore e lo rendo stringa
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));

  }


        logCartData(totalPriceValue: number, totalQuantityValue: number) {
          for(let tempCartItem of this.cartItems){
            console.log('Contents of the cart');
            const subTotalPrice= tempCartItem.quantity* tempCartItem.unit_price;
            console.log(`name: ${tempCartItem.name},quantity: ${tempCartItem.quantity}
              ,unitPrice: ${tempCartItem.unit_price}
              ,subTotalPrice: ${subTotalPrice}`);
          }
          //to fixed(2)---> due cifre dopo la virgola
          console.log(`totalPrice: ${totalPriceValue.toFixed(2)},totalQuantity:${totalQuantityValue}`);
          console.log(`--------------`);
        }
}
