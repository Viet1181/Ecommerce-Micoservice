package com.nguyenquocviet.productcatalogservice.service;

import java.util.List;
import java.math.BigDecimal;

import com.nguyenquocviet.productcatalogservice.entity.Product;

public interface ProductService {
    public List<Product> getAllProduct();
    public List<Product> getAllProductByCategory(String category);
    public Product getProductById(Long id);
    public List<Product> getAllProductsByName(String name);
    public Product addProduct(Product product);
    public Product updateProduct(Long id, Product product);
    public void deleteProduct(Long productId);
    public List<Product> searchProducts(String name, String category, BigDecimal minPrice, BigDecimal maxPrice, String sortBy, String sortDirection);
}
