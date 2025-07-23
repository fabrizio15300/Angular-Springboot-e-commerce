package com.ProgettoEcommerce.spring_boot_ecommerce.service;

import com.ProgettoEcommerce.spring_boot_ecommerce.dao.CustomerRepository;
import com.ProgettoEcommerce.spring_boot_ecommerce.dto.Purchase;
import com.ProgettoEcommerce.spring_boot_ecommerce.dto.PurchaseResponse;
import com.ProgettoEcommerce.spring_boot_ecommerce.entity.Customer;
import com.ProgettoEcommerce.spring_boot_ecommerce.entity.Order;
import com.ProgettoEcommerce.spring_boot_ecommerce.entity.OrderItem;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService{

    private CustomerRepository customerRepository;

    public CheckoutServiceImpl(CustomerRepository customerRepository){
        this.customerRepository=customerRepository;
    }



    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {

        //retrieve the order from DTO
        Order order=purchase.getOrder();


        //genero il numero di tracking
        String orderTrackingNumber= generateOrdertrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        //popolo order con orderItems
        Set<OrderItem> orderItems=purchase.getOrderItems();
        orderItems.forEach(item-> order.add(item));


        //popolo order con indirizzo di fatturazione e spedizione
        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());

        //popolo Customer con order
        Customer customer= purchase.getCustomer();

        //verifico se il customer esiste già
        String theEmail= customer.getEmail();

        Customer customerFromDB= customerRepository.findByEmail(theEmail);

        if(customerFromDB!= null){
            //lo abbiamo trovato
            customer =customerFromDB;
        }

        customer.add(order);

        //salvo nel DB usando JPA repository tramite Customer repository
        customerRepository.save(customer);

        //return
        return new PurchaseResponse(orderTrackingNumber);


    }

    private String generateOrdertrackingNumber() {
        //voglio creare un id unico e random(UUID) CHE STA PER UNIVERSALLY UNIQUE IDENTIFIER
        return UUID.randomUUID().toString();




    }
}
