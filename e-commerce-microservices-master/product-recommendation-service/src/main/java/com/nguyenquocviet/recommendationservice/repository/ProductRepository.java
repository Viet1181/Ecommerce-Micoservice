package com.nguyenquocviet.recommendationservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nguyenquocviet.recommendationservice.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
}
