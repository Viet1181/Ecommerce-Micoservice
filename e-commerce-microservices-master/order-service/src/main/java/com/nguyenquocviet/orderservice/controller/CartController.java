package com.nguyenquocviet.orderservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.nguyenquocviet.orderservice.http.header.HeaderGenerator;
import com.nguyenquocviet.orderservice.service.CartService;
import com.nguyenquocviet.orderservice.domain.Item;

import java.util.Arrays;
import java.util.Collections;
import java.util.Enumeration;
import java.util.List;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;

@RestController
@RequestMapping("/shop/cart")
public class CartController {

    private static final Logger log = LoggerFactory.getLogger(CartController.class);

    @Autowired
    CartService cartService;

    @Autowired
    private HeaderGenerator headerGenerator;

    private String getCartIdFromCookies(HttpServletRequest request) {
        log.info("=== Debugging Cookie Information ===");
        
        // Try to get from cookie header first
        String cookieHeader = request.getHeader(HttpHeaders.COOKIE);
        log.info("Cookie header: {}", cookieHeader);
        
        if (cookieHeader != null) {
            String[] cookies = cookieHeader.split(";");
            for (String cookie : cookies) {
                cookie = cookie.trim();
                log.info("Processing cookie: {}", cookie);
                if (cookie.startsWith("cartId=")) {
                    String cartId = cookie.substring("cartId=".length());
                    log.info("Found cartId in cookie header: {}", cartId);
                    return cartId;
                }
            }
        }
        
        // If not found in header, try cookies array
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                log.info("Cookie from array: {}={}", cookie.getName(), cookie.getValue());
                if ("cartId".equals(cookie.getName())) {
                    log.info("Found cartId in cookie array: {}", cookie.getValue());
                    return cookie.getValue();
                }
            }
        }
        
        // Try query parameter as last resort
        String cartIdParam = request.getParameter("cartId");
        if (cartIdParam != null && !cartIdParam.isEmpty()) {
            log.info("Found cartId in query parameter: {}", cartIdParam);
            return cartIdParam;
        }
        
        log.info("No cartId found in any source");
        return null;
    }

    @GetMapping("")
    public ResponseEntity<CartResponse> getCart(HttpServletRequest request, HttpServletResponse response) {
        log.info("=== GET /cart - Start ===");
        log.info("Request URI: {}", request.getRequestURI());
        log.info("Request URL: {}", request.getRequestURL());
        log.info("Method: {}", request.getMethod());
        log.info("Query String: {}", request.getQueryString());
        log.info("Remote Host: {}", request.getRemoteHost());
        log.info("Headers:");
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            log.info("{}: {}", headerName, request.getHeader(headerName));
        }
        
        String cartId = getCartIdFromCookies(request);
        if (cartId == null) {
            log.info("No cartId found in request - returning BAD_REQUEST");
            return ResponseEntity.badRequest().build();
        }

        log.info("GET /cart - Using CartID: {}", cartId);
        
        try {
            List<Object> cartItems = cartService.getCart(cartId);
            log.info("Retrieved cart for {}: {}", cartId, cartItems);
            
            if (cartItems == null) {
                cartItems = Collections.emptyList();
            }
            
            // Tính tổng giá trị giỏ hàng
            double totalPrice = 0.0;
            if (!cartItems.isEmpty()) {
                totalPrice = cartItems.stream()
                    .filter(item -> item instanceof Item)
                    .map(item -> (Item) item)
                    .mapToDouble(item -> item.getSubTotal().doubleValue())
                    .sum();
            }
            
            CartResponse cartResponse = new CartResponse(cartItems, totalPrice);
            return ResponseEntity.ok(cartResponse);
        } catch (Exception e) {
            log.error("Error processing cart", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("")
    public ResponseEntity<CartResponse> addItemToCart(
            @RequestParam("productId") Long productId,
            @RequestParam("quantity") Integer quantity,
            HttpServletRequest request,
            HttpServletResponse response) {
        
        log.info("=== POST /cart - Start ===");
        String cartId = getCartIdFromCookies(request);
        
        if (cartId == null) {
            log.info("No cartId found in request - returning BAD_REQUEST");
            return ResponseEntity.badRequest().build();
        }
        
        log.info("POST /cart - ProductID: {}, Quantity: {}, CartID: {}", productId, quantity, cartId);
        
        try {
            cartService.addItemToCart(cartId, productId, quantity);
            log.info("Added item to cart");
            
            // Lấy và trả về dữ liệu giỏ hàng mới nhất
            List<Object> cartItems = cartService.getCart(cartId);
            
            // Tính tổng giá trị giỏ hàng
            double totalPrice = 0.0;
            if (cartItems != null && !cartItems.isEmpty()) {
                totalPrice = cartItems.stream()
                    .filter(item -> item instanceof Item)
                    .map(item -> (Item) item)
                    .mapToDouble(item -> item.getSubTotal().doubleValue())
                    .sum();
            }
            
            CartResponse cartResponse = new CartResponse(cartItems, totalPrice);
            return ResponseEntity.ok(cartResponse);
        } catch (Exception e) {
            log.error("Error adding item to cart", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("")
    public ResponseEntity<Void> removeItemFromCart(
            @RequestParam("productId") Long productId,
            HttpServletRequest request,
            HttpServletResponse response) {
        
        log.info("=== DELETE /cart - Start ===");
        log.info("Request URI: {}", request.getRequestURI());
        log.info("Request URL: {}", request.getRequestURL());
        log.info("Method: {}", request.getMethod());
        log.info("Query String: {}", request.getQueryString());
        log.info("Remote Host: {}", request.getRemoteHost());
        log.info("Headers:");
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            log.info("{}: {}", headerName, request.getHeader(headerName));
        }
        
        String cartId = getCartIdFromCookies(request);
        if (cartId == null) {
            log.info("No cartId found in request - returning BAD_REQUEST");
            return ResponseEntity.badRequest().build();
        }

        log.info("DELETE /cart - ProductID: {}, CartID: {}", productId, cartId);
        
        try {
            cartService.deleteItemFromCart(cartId, productId);
            log.info("Removed item from cart");
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error removing item from cart", e);
            return ResponseEntity.badRequest().build();
        }
    }

    class CartResponse {
        private List<Object> products;
        private double totalPrice;

        public CartResponse(List<Object> products, double totalPrice) {
            this.products = products;
            this.totalPrice = totalPrice;
        }

        public List<Object> getProducts() {
            return products;
        }

        public void setProducts(List<Object> products) {
            this.products = products;
        }

        public double getTotalPrice() {
            return totalPrice;
        }

        public void setTotalPrice(double totalPrice) {
            this.totalPrice = totalPrice;
        }
    }
}