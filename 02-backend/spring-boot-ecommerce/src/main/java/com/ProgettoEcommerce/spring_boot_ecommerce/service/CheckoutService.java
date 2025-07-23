package com.ProgettoEcommerce.spring_boot_ecommerce.service;

import com.ProgettoEcommerce.spring_boot_ecommerce.dto.Purchase;
import com.ProgettoEcommerce.spring_boot_ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);





}
