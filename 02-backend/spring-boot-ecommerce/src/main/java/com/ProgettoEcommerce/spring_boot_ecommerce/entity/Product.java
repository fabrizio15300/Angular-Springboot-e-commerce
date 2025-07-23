package com.ProgettoEcommerce.spring_boot_ecommerce.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;


import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name="product")
@Data //generate get e set dietro le quinte(lombock)

public class Product {

    //caratteristiche del prodotto in vetrina
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)

    @Column(name= "id")
    private  Long id;

    @ManyToOne
    @JoinColumn(name= "category_id", nullable=false)
    private ProductCategory category;


    @Column(name= "sku")
    private String sku;

    @Column(name= "name")
    private String name;

    @Column(name= "description")
    private String description;

    @Column(name= "unitPrice")
    private BigDecimal unit_price;

    @Column(name= "imageUrl")
    private String imageUrl;

    @Column(name= "active")
    private boolean active;

    @Column(name= "unitsInStock")
    private int unitsInStock;

    @Column(name= "date_Created")
    @CreationTimestamp
    private Date dateCreated;

    @Column(name= "last_Updated")
    @CreationTimestamp
    private Date lastUpdated;




}//Product
