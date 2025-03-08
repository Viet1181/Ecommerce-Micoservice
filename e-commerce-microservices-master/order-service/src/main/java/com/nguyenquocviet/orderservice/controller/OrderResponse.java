package com.nguyenquocviet.orderservice.controller;

import java.util.List;
import com.nguyenquocviet.orderservice.domain.Order;

public class OrderResponse {
    private boolean success;
    private String message;
    private List<Order> orders;

    public OrderResponse(boolean success, String message, List<Order> orders) {
        this.success = success;
        this.message = message;
        this.orders = orders;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<Order> getOrders() {
        return orders;
    }

    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }
}
