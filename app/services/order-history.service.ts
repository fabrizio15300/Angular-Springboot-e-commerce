import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  private orderUrl='http://localhost:8080/api/orders';


  constructor(private httpClient: HttpClient) { }

  getOrderHistory(theEmail:string): Observable<GetResponseOrderHistory>{

    //buildo l'url basato sull'email
    const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmail?email=${theEmail}`;

    return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl);
  }



}//OrderHistoryService

 interface GetResponseOrderHistory{
  _embedded:{
    orders:OrderHistory[];
  }


}