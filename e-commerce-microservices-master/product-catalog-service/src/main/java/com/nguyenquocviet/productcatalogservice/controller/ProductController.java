package com.nguyenquocviet.productcatalogservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.nguyenquocviet.productcatalogservice.entity.Product;
import com.nguyenquocviet.productcatalogservice.http.header.HeaderGenerator;
import com.nguyenquocviet.productcatalogservice.service.ProductService;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RestController
public class ProductController {

    @Autowired
    private ProductService productService;
    
    @Autowired
    private HeaderGenerator headerGenerator;

    @GetMapping (value = "/products")
    public ResponseEntity<List<Product>> getAllProducts(){
        List<Product> products =  productService.getAllProduct();
        if(!products.isEmpty()) {
        	return new ResponseEntity<List<Product>>(
        			products,
        			headerGenerator.getHeadersForSuccessGetMethod(),
        			HttpStatus.OK);
        }
        return new ResponseEntity<List<Product>>(
        		headerGenerator.getHeadersForError(),
        		HttpStatus.NOT_FOUND);       
    }

    @GetMapping(value = "/products", params = "category")
    public ResponseEntity<List<Product>> getAllProductByCategory(@RequestParam ("category") String category){
        List<Product> products = productService.getAllProductByCategory(category);
        if(!products.isEmpty()) {
        	return new ResponseEntity<List<Product>>(
        			products,
        			headerGenerator.getHeadersForSuccessGetMethod(),
        			HttpStatus.OK);
        }
        return new ResponseEntity<List<Product>>(
        		headerGenerator.getHeadersForError(),
        		HttpStatus.NOT_FOUND);
    }

    @GetMapping (value = "/products/{id}")
    public ResponseEntity<Product> getOneProductById(@PathVariable ("id") long id){
        Product product =  productService.getProductById(id);
        if(product != null) {
        	return new ResponseEntity<Product>(
        			product,
        			headerGenerator.getHeadersForSuccessGetMethod(),
        			HttpStatus.OK);
        }
        return new ResponseEntity<Product>(
        		headerGenerator.getHeadersForError(),
        		HttpStatus.NOT_FOUND);
    }

    @GetMapping (value = "/products", params = "name")
    public ResponseEntity<List<Product>> getAllProductsByName(@RequestParam ("name") String name){
        List<Product> products =  productService.getAllProductsByName(name);
        if(!products.isEmpty()) {
        	return new ResponseEntity<List<Product>>(
        			products,
        			headerGenerator.getHeadersForSuccessGetMethod(),
        			HttpStatus.OK);
        }
        return new ResponseEntity<List<Product>>(
        		headerGenerator.getHeadersForError(),
        		HttpStatus.NOT_FOUND);
    }
    @GetMapping (value = "/products/search")
    public ResponseEntity<?> searchProducts(
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "minPrice", required = false) String minPrice,
            @RequestParam(value = "maxPrice", required = false) String maxPrice,
            @RequestParam(value = "sortBy", required = false, defaultValue = "id") String sortBy,
            @RequestParam(value = "sortDirection", required = false, defaultValue = "asc") String sortDirection) {
        
        try {
            BigDecimal minPriceBD = minPrice != null ? new BigDecimal(minPrice) : null;
            BigDecimal maxPriceBD = maxPrice != null ? new BigDecimal(maxPrice) : null;
            
            List<Product> products = productService.searchProducts(name, category, minPriceBD, maxPriceBD, sortBy, sortDirection);
            
            if(!products.isEmpty()) {
                return new ResponseEntity<>(
                        products,
                        headerGenerator.getHeadersForSuccessGetMethod(),
                        HttpStatus.OK);
            }
            return new ResponseEntity<>(
                    new ArrayList<>(),
                    headerGenerator.getHeadersForSuccessGetMethod(),
                    HttpStatus.OK);
        } catch (NumberFormatException e) {
            return new ResponseEntity<>(
                    Collections.singletonMap("error", "Giá trị giá không hợp lệ"),
                    headerGenerator.getHeadersForError(),
                    HttpStatus.BAD_REQUEST);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(
                    Collections.singletonMap("error", e.getMessage()),
                    headerGenerator.getHeadersForError(),
                    HttpStatus.BAD_REQUEST);
        }
    }
   
}
