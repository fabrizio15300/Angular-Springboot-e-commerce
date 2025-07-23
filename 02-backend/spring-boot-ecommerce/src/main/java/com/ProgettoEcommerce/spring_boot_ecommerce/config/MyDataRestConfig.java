package com.ProgettoEcommerce.spring_boot_ecommerce.config;

import com.ProgettoEcommerce.spring_boot_ecommerce.entity.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.w3c.dom.Entity;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    private EntityManager entityManager;

    //injecto dall file .properties
    @Value("${allowed.origins}")
    private String[] theAllowedOrigins;

    @Autowired
    public MyDataRestConfig(EntityManager theEntityManager) {
        entityManager = theEntityManager;
    }


    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        RepositoryRestConfigurer.super.configureRepositoryRestConfiguration(config, cors);

        HttpMethod[] theUnsupportedActions={HttpMethod.PUT,HttpMethod.POST,HttpMethod.DELETE,HttpMethod.PATCH};

        //disabilita i metodi che richiedono accesso al PRODUCT_CATEGORY, rendendo le rest Api READ ONLY
        disableHttpMethods(Product.class,config, theUnsupportedActions);
        disableHttpMethods(ProductCategory.class,config, theUnsupportedActions);
        disableHttpMethods(Country.class,config, theUnsupportedActions);
        disableHttpMethods(State.class,config, theUnsupportedActions);

        disableHttpMethods(Order.class,config, theUnsupportedActions);

        //SOLO GET FUNZIONERA'

        //chiamo unmetodo interno
        exposeIds(config);

        //configuro cors mapping
        cors.addMapping(config.getBasePath() +"/**").allowedOrigins(theAllowedOrigins);

    }

    private static void disableHttpMethods(Class theClass,RepositoryRestConfiguration config, HttpMethod[] theUnsupportedActions) {
        config.getExposureConfiguration()
                .forDomainType(theClass)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions) )
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions));
    }

    private void exposeIds(RepositoryRestConfiguration config) {
        //espone l'id delle entity
        //prende una lista di tutte le classi entity dall'entitymanager
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        //creo un array di entityTypes
        List<Class> entityClasses =new ArrayList<>();

        //prendo gli entity types per le entità
        for(EntityType tempEntityType : entities){
            entityClasses.add(tempEntityType.getJavaType());
        }

        //espongo gli entity ids
        Class[] domainType = entityClasses.toArray(new Class[0]);
        config.exposeIdsFor(domainType);


    }//ExposeIds


}//CLASS
