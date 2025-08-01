package com.ProgettoEcommerce.spring_boot_ecommerce.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name="customer")
@Getter
@Setter
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @Column(name="first_name")
    private String firstName;

    @Column(name="last_name")
    private String LastName;

    @Column(name="email")
    private String email;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    private Set<Order> orders= new HashSet<>();

    public void add(Order order){
        if(order != null){
            if(orders==null){
                orders= new HashSet<>();
            }
            orders.add(order);
            order.setCustomer(this);
        }
    }



}
