package com.nguyenquocviet.orderservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nguyenquocviet.orderservice.domain.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
}
