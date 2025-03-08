package com.nguyenquocviet.orderservice.repository;

import com.nguyenquocviet.orderservice.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByUserName(String userName);
}