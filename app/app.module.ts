import { inject, Inject, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import{ HttpClientModule } from '@angular/common/http'
import { ProductService } from './services/product.service';

import { Router, RouterModule, Routes } from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDatailsComponent } from './components/cart-datails/cart-datails.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { LoginStatusComponent } from './components/login-status/login-status.component';
import{
  OktaAuthModule,
  OktaCallbackComponent,
  OKTA_CONFIG,
  OktaAuthGuard
} from '@okta/okta-angular';

import { OktaAuth } from '@okta/okta-auth-js';
import myAppConfig from './config/my-app-config';
import { MembersPageComponent } from './components/members-page/members-page.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';

const oktaConfig = myAppConfig.oidc;

const oktaAuth = new OktaAuth(oktaConfig);
function sendToLoginPage(oktaAuth: OktaAuth, injector: Injector){
  //uso l'inject per accedere ai servizi

  const router = injector.get(Router);

  //reindizizzo lo user nella custom login pageng
  router.navigate(['/login']);
  
}

//routes devono essere scritte in ordine dal più specifico al generico
const routes: Routes = [


      {path: 'order-history', component: OrderHistoryComponent,canActivate: [OktaAuthGuard],
                            data: {onAuthRequired: sendToLoginPage}  },  
      //UTILIZZO OKTA ROUTE GUARD PER I MEMBRI
      {path: 'members', component: MembersPageComponent, canActivate: [OktaAuthGuard],
                             data: {onAuthRequired: sendToLoginPage}  },
          
      {path: 'login/callback', component: OktaCallbackComponent},  
      {path: 'login', component: LoginComponent},  

      {path: 'checkout', component: CheckoutComponent},
      {path: 'cart-details', component: CartDatailsComponent},
      {path: 'products/:id', component: ProductDetailsComponent},
      {path: 'search/:keyword', component: ProductListComponent},
      {path: 'category/:id', component: ProductListComponent},
      {path: 'category', component: ProductListComponent},
      {path: 'products', component: ProductListComponent},
      {path: '',redirectTo: '/products', pathMatch :'full'},
      {path: '**', redirectTo : '/products', pathMatch: 'full'},
      

];

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDatailsComponent,
    CheckoutComponent,
    LoginComponent,
    LoginStatusComponent,
    MembersPageComponent,
    OrderHistoryComponent
  ],
  imports: [
    //agiungo l'import per le routes
    RouterModule.forRoot(routes),
    BrowserModule,
    //devo aggoiungere l'import per httpClientModule
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    OktaAuthModule

  ],
  providers: [ProductService, {provide: OKTA_CONFIG, useValue: { oktaAuth }}],
  bootstrap: [AppComponent]
})
export class AppModule { }
