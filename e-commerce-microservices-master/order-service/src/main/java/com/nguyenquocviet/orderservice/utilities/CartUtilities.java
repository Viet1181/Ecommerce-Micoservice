package com.nguyenquocviet.orderservice.utilities;

import java.math.BigDecimal;

import com.nguyenquocviet.orderservice.domain.Product;

public class CartUtilities {

    public static BigDecimal getSubTotalForItem(Product product, int quantity){
       return (product.getPrice()).multiply(BigDecimal.valueOf(quantity));
    }
}
