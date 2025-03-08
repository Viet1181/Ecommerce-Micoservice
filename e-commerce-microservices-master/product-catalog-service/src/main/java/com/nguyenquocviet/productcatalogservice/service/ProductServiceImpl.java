package com.nguyenquocviet.productcatalogservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nguyenquocviet.productcatalogservice.entity.Product;
import com.nguyenquocviet.productcatalogservice.repository.ProductRepository;

import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<Product> getAllProduct() {
        return productRepository.findAll();
    }

    @Override
    public List<Product> getAllProductByCategory(String category) {
        return productRepository.findAllByCategory(category);
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    @Override
    public List<Product> getAllProductsByName(String name) {
        return productRepository.findAllByProductName(name);
    }

    @Override
    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public void deleteProduct(Long productId) {
        productRepository.deleteById(productId);
    }

    @Override
    @Transactional
    public Product updateProduct(Long id, Product updatedProduct) {
        Product existingProduct = productRepository.getOne(id);
        if (existingProduct != null) {
            existingProduct.setProductName(updatedProduct.getProductName());
            existingProduct.setPrice(updatedProduct.getPrice());
            existingProduct.setDescription(updatedProduct.getDescription());
            existingProduct.setCategory(updatedProduct.getCategory());
            existingProduct.setAvailability(updatedProduct.getAvailability());
            existingProduct.setImageUrl(updatedProduct.getImageUrl());
            return productRepository.save(existingProduct);
        }
        return null;
    }

    @Override
    public List<Product> searchProducts(String name, String category, BigDecimal minPrice, BigDecimal maxPrice, String sortBy, String sortDirection) {
        try {
            // Validate price range
            if (minPrice != null && minPrice.compareTo(BigDecimal.ZERO) < 0) {
                throw new IllegalArgumentException("Giá tối thiểu không được âm");
            }
            if (maxPrice != null && maxPrice.compareTo(BigDecimal.ZERO) < 0) {
                throw new IllegalArgumentException("Giá tối đa không được âm");
            }
            if (minPrice != null && maxPrice != null && minPrice.compareTo(maxPrice) > 0) {
                throw new IllegalArgumentException("Giá tối thiểu không được lớn hơn giá tối đa");
            }

            // Validate and normalize sort direction
            String normalizedDirection = sortDirection.toLowerCase();
            if (!normalizedDirection.equals("asc") && !normalizedDirection.equals("desc")) {
                normalizedDirection = "asc"; // Default to ascending if invalid
            }
            Sort.Direction direction = Sort.Direction.fromString(normalizedDirection);

            // Validate sort field
            if (!isValidSortField(sortBy)) {
                sortBy = "id"; // Default to id if invalid
            }

            Sort sort = Sort.by(direction, sortBy);
            return productRepository.searchProducts(name, category, minPrice, maxPrice, sort);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi tìm kiếm sản phẩm: " + e.getMessage());
        }
    }

    private boolean isValidSortField(String field) {
        return field != null && (
            field.equals("id") ||
            field.equals("productName") ||
            field.equals("price") ||
            field.equals("category")
        );
    }
}
