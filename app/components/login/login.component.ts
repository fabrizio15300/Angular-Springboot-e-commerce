import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { isRedirectUri, OktaAuth } from '@okta/okta-auth-js';
import myAppConfig from 'src/app/config/my-app-config';
import OktaSignIn from '@okta/okta-signin-widget';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  

  oktaSignin : any;
  

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { 

    this.oktaSignin = new OktaSignIn({
      logo:'assets/images/logo.png',
      baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0],
      clientId:myAppConfig.oidc.clientId,
      redirectUri: myAppConfig.oidc.redirectUri,
      authPrams:{
        //proof key for code exchange
        pkce: true,
        issuer: myAppConfig.oidc.issuer,
        scopes:myAppConfig.oidc.scopes
      }
    });

  }

  ngOnInit(): void {

    this.oktaSignin.remove();
    
    this.oktaSignin.renderEl({
    //element
    el: '#okta-sign-in-widget'}, //stesso nome del "div tag" nel login.component.html
    (response: any)=>{
      if(response.status === 'SUCCESS'){
        this.oktaAuth.signInWithRedirect();
      }
    },
    (error:any)=> {
      throw error;
    }
    )

  }
}