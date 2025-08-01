package com.ProgettoEcommerce.spring_boot_ecommerce.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Entity
@Table(name="product_category")
//Data -- known bug
@Getter
@Setter

public class ProductCategory {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)

    @Column(name= "id")
    private Long id;

    @Column(name= "categoryName")
    private String categoryName;

   @OneToMany(cascade=CascadeType.ALL,mappedBy = "category")
    private Set<Product> products;




}//Product_Category
