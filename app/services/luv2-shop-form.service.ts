import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {

private contriesUrl='http://localhost:8080/api/countries';
private statesUrl='http://localhost:8080/api/states';

  constructor(private htttpClient:HttpClient) { }

  getCountries(): Observable<Country[]>{
    return this.htttpClient.get<GetResponseCountries>(this.contriesUrl).pipe(
      map(response => response._embedded.countries)
    );

  }

  getStates(theCountryCode: string): Observable<State[]>{
    
    //search url
    const searchStatesUrl= `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;
    
    return this.htttpClient.get<GetResponseStates>(searchStatesUrl).pipe(
      map(response => response._embedded.states)
    );

  }



getCreditCardMonths(startMonth: number):Observable<number[]>{

  let data: number[]=[];

  //build an array for Months

  for(let theMonth = startMonth; theMonth <= 12; theMonth++){
    data.push(theMonth);
  }
  return of(data);

}

getCreditCardYears(): Observable<number[]>{

  let data: number[]=[];
  //uguale a prima
  const startYear: number = new Date().getFullYear();
  const endYear: number = startYear + 10;

  for(let theYear=startYear; theYear <= endYear; theYear++){
    data.push(theYear);

  }
  return of(data);
  
}


}//Classe



 interface GetResponseCountries{
  _embedded:{
    countries: Country[];
  }

 }

 interface GetResponseStates{
  _embedded:{
    states: State[];
  }
}