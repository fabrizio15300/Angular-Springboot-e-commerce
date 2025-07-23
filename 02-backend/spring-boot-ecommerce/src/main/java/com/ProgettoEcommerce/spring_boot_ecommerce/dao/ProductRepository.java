package com.ProgettoEcommerce.spring_boot_ecommerce.dao;


import com.ProgettoEcommerce.spring_boot_ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

@RepositoryRestResource
public interface ProductRepository extends JpaRepository<Product,Long> {

    //query method
    Page<Product> findByCategoryId(@Param("id") Long id, Pageable pageable);
    //query method for search
    Page<Product> findByNameContaining(@Param("name") String name, Pageable pageable);



}//ProductRepository
