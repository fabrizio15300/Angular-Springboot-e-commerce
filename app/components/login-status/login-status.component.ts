import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {


  isAuthenticated: boolean = false;
  userFullName: string = '';

  storage: Storage= sessionStorage;


  constructor(private oktaAuthService: OktaAuthStateService,
              @Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }

  ngOnInit(): void {

    //subscribe ai cambi di stato dell'autenticazione
    this.oktaAuthService.authState$.subscribe(
      (result)=>{
        this.isAuthenticated = result.isAuthenticated!;
        this.getUserDetails();
      }
    );

  }
  getUserDetails() {

    //se ha fatto l'autenticazione
      if(this.isAuthenticated){

        //prendi l'User
         this.oktaAuth.getUser().then(
          (res)=>{
            //prendo il nome del mio USER
            this.userFullName = res.name as string;
         
              // se è autenticato utilizzo l'email dello user
              const theEmail=res.email;

              //salvo l'e mail nel browser(key,value)
              this.storage.setItem('userEmail',JSON.stringify(theEmail));
              
            }
         );
      }


  }

  //mi serve il metodo per fare il logout
  logout(){

    //faccio terminare la sessione con OKTA ed elimino il token corrente
    this.oktaAuth.signOut();
  }


}
