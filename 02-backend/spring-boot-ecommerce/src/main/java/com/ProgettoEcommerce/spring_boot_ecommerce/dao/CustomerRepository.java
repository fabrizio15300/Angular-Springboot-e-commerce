package com.ProgettoEcommerce.spring_boot_ecommerce.dao;


import com.ProgettoEcommerce.spring_boot_ecommerce.entity.Country;
import com.ProgettoEcommerce.spring_boot_ecommerce.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;


public interface CustomerRepository extends JpaRepository<Customer, Long> {

        Customer findByEmail(String theEmail);

}
