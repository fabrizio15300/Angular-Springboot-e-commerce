package com.ProgettoEcommerce.spring_boot_ecommerce.controller;

import com.ProgettoEcommerce.spring_boot_ecommerce.dto.Purchase;
import com.ProgettoEcommerce.spring_boot_ecommerce.dto.PurchaseResponse;
import com.ProgettoEcommerce.spring_boot_ecommerce.service.CheckoutService;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("api/checkout")
public class CheckoutController {

        private CheckoutService checkoutService;

        //costruttore
        public CheckoutController(CheckoutService checkoutService){
            this.checkoutService=checkoutService;
        }

            @PostMapping("/purchase")
    public PurchaseResponse placeOrder(@RequestBody Purchase purchase){
            PurchaseResponse purchaseResponse=checkoutService.placeOrder(purchase);
            return purchaseResponse;

            }


}
