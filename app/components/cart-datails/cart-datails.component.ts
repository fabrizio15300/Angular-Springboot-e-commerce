import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-datails',
  templateUrl: './cart-datails.component.html',
  styleUrls: ['./cart-datails.component.css']
})
export class CartDatailsComponent implements OnInit {

cartItems: CartItem[]=[];
totalPrice:number=0;
totalQuantity: number=0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails() {
    //gestione degli oggetti nel carrello

    this.cartItems=this.cartService.cartItems;

    //sottoscrizione del price
    this.cartService.totalPrice.subscribe(
      data=> this.totalPrice=data
    );
    //sottoscrizione della quantity
    this.cartService.totalQuantity.subscribe(
      data=> this.totalQuantity=data
    );
    //computazione del totale e quantità
    this.cartService.computeCartTotals();


  }


incrementQuantity(theCartItem: CartItem){
  this.cartService.addToCart(theCartItem);

}
decrementQuantity(theCartItem: CartItem){
  this.cartService.decrementQuantity(theCartItem);

}
 remove(theCartItem:CartItem){
  this.cartService.remove(theCartItem);
 }


}//CartDetailsComponent
