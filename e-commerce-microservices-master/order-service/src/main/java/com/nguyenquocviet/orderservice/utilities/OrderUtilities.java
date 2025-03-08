package com.nguyenquocviet.orderservice.utilities;

import java.math.BigDecimal;
import java.util.List;

import com.nguyenquocviet.orderservice.domain.Item;

public class OrderUtilities {

    public static BigDecimal countTotalPrice(List<Item> cart) {
        BigDecimal total = BigDecimal.ZERO;
        for(Item item : cart) {
            total = total.add(item.getSubTotal());
        }
        return total;
    }
}
