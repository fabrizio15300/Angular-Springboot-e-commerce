import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

 

  //inject the dependences

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;
  

  //nuove proprietà per la paginazione
  thePageNumber:number =1;
  thePageSize:number = 5;
  theTotalElements:number = 0;
  
  previousKeyword: string="";

  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private cartService: CartService) { }

  ngOnInit(){
    this.route.paramMap.subscribe(() => {
    this.listProducts();
    });
  }

  //connesione al service per ottenere i dati
  listProducts() {
    this.searchMode=this.route.snapshot.paramMap.has('keyword');

    //se sono in search mode mostra i ricercati, altrimenti tutti
    if(this.searchMode){
      this.handleSearchProducts();
    }
    else{
      this.handleListProducts();
    }

    
  }
     
  //gestione ricerca prodotti
  handleSearchProducts(){

    const theKeyword: string= this.route.snapshot.paramMap.get('keyword')!;
      //se ho una keyword diversa setto il pageNumber ad 1

      if(this.previousKeyword!=theKeyword){
        this.thePageNumber=1;
      }
        this.previousKeyword=theKeyword;
        console.log(`keyword=${theKeyword},thePageNumber=${this.thePageNumber}`);

    //ora cerco i prodotti usando la keyword
    this.productService.searchProductsPaginate(this.thePageNumber-1,
                                              this.thePageSize,
                                              theKeyword).subscribe(this.processResult());
     
      

  }
  
  //gestione lista prodotti
  handleListProducts(){
     //verifico se l'id è disponibile
     const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    
     if(hasCategoryId){
 
       //prende l'id  come stringa e lo converto in number,uso ! per dire al compilatore che l'ogetto non è null
       this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
     }
     else{
       //id non disponibile- default in category 1
       this.currentCategoryId = 1;
     }
     
     //verifico se abbiamo un diverso categoryId, perchèp angular tende a richiamare quello gia visto sul browser
     //se ho un categoryid diverso setto il page id alla prima
     if(this.previousCategoryId!= this.currentCategoryId){
        this.thePageNumber=1;
     }
     this.previousCategoryId=this.currentCategoryId;
     console.log(`currentCategoryId=${this.currentCategoryId},thePageNumber=${this.thePageNumber}`);



     //prendere il prodotto per la categoria
     //setto pagewnumber -1 perche in spring data rest le pagine sono "zero-based", nel component sono "one-based"
     this.productService.getProductListPaginate(this.thePageNumber-1,
                                                this.thePageSize,
                                                this.currentCategoryId)
                                                .subscribe(this.processResult());
     
     
   }

   updatePageSize(pageSize: string){
    //l'operatore + mi permette la conversione di tipo
       this.thePageSize=+pageSize;
       this.thePageNumber=1;
       this.listProducts();
   }

   processResult(){
    return (data: any)=>{
      this.products=data._embedded.products;
      this.thePageNumber=data.page.number+1;
      this.thePageSize=data.page.size;
      this.theTotalElements=data.page.totalElements;
    };
   }//processRESULT

addToCart(theProduct : Product){
  console.log(`Adding to Cart:${theProduct.name},${theProduct.unit_price}`);
    
    const theCartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);
  
  
}

  }

