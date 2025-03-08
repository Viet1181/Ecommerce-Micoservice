package com.nguyenquocviet.orderservice.feignclient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import com.nguyenquocviet.orderservice.domain.User;

@FeignClient(name = "user-service")
public interface UserClient {
    @GetMapping(value = "/users/{id}")
    ResponseEntity<User> getUserById(@PathVariable("id") Long id);
    @GetMapping(value = "/users", params = "name")
    ResponseEntity<User> getUserByName(@RequestParam("name") String name);

}
