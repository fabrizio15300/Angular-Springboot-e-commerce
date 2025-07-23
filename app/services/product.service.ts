import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

 
  //url per comunicare con le REST API tramite richieste
    private basic_url= 'http://localhost:8080/api/products';
    private category_url= 'http://localhost:8080/api/product-category';

  constructor(private httpClient: HttpClient) { }

  getProduct(theProductId: number):Observable<Product> {
    //buildare l'url in base all id
    const productUrl = `${this.basic_url}/${theProductId}`;
    
    return this.httpClient.get<Product>(productUrl);
  }


  getProductListPaginate(thePage: number,
                         thePageSize: number,
                         theCategoryId:number): Observable<GetResponseProducts> {
    
    //buildare l'url basato sul category id, pages, e size
   const searchUrl = `${this.basic_url}/search/findByCategoryId?id=${theCategoryId}`
                   +`&page=${thePage}&size=${thePageSize}`;
   
   return this.httpClient.get<GetResponseProducts>(searchUrl);
 }//productListPaginate



  //richiesta tramite url del back-end,prendere i dati e vederli come lista di prodotti
  getProductList(theCategoryId: number): Observable<Product[]> {
    
     //buildare l'url basato sul category id.....
    const searchUrl = `${this.basic_url}/search/findByCategoryId?id=${theCategoryId}`;
    
    return this.getProducts(searchUrl);
  }

  searchProducts(theKeyword: string) :Observable<Product[]> {
    //mi serve un url basato su keyword stavolta
    const searchUrl = `${this.basic_url}/search/findByNameContaining?name=${theKeyword}`;
    
    return this.getProducts(searchUrl);
  }

  searchProductsPaginate(thePage: number,
                          thePageSize: number,
                          theKeyword:string): Observable<GetResponseProducts> {

  //buildare l'url basato sulla keyword(ricerca), pages, e size
  const searchUrl = `${this.basic_url}/search/findByNameContaining?name=${theKeyword}`
                  +`&page=${thePage}&size=${thePageSize}`;

  return this.httpClient.get<GetResponseProducts>(searchUrl);
  }//SearchProductPaginate



  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductCategories() : Observable<ProductCategory[]> {
    //chiamo le REST API,RESTISTUISCO UN OBSERVABLE, MAPPO I JSON DATA DA SPRIN DATA REST ALL'ARRAY productcategory
    return this.httpClient.get<GetResponseProductCategory>(this.category_url).pipe(
      map(response => response._embedded.productCategory)
    );
  }//getProductCategories



}//Class

//questa interfaccia mi permette di vedere i dati nel JSON E UTILIZZARLI
    interface GetResponseProducts{
        _embedded: {
          products :Product[];

        },
        //aggiungo le info di paginazione nella mia interfaccia
        page:{
          size:number,
          totalElements:number,
          totalePages:number,
          number:number
        }
    
      }//Interface

         
      interface GetResponseProductCategory{
        _embedded: {
          productCategory :ProductCategory[];
        };
    
    
      }//Interface
