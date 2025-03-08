package com.nguyenquocviet.orderservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.nguyenquocviet.orderservice.domain.*;
import com.nguyenquocviet.orderservice.feignclient.UserClient;
import com.nguyenquocviet.orderservice.http.header.HeaderGenerator;
import com.nguyenquocviet.orderservice.service.CartService;
import com.nguyenquocviet.orderservice.service.OrderService;
import com.nguyenquocviet.orderservice.service.PayPalService;
import com.nguyenquocviet.orderservice.utilities.OrderUtilities;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.math.BigDecimal;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;

import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import com.nguyenquocviet.orderservice.repository.UserRepository; // Thêm dòng này
@RestController
@RequestMapping("/shop/order")
public class OrderController {

    private static final Logger log = LoggerFactory.getLogger(OrderController.class);
    @Autowired
    private UserRepository userRepository; // Khai báo userRepository

    @Autowired
    private UserClient userClient;
    
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private CartService cartService;

    @Autowired
    private HeaderGenerator headerGenerator;

    @Autowired
    private PayPalService payPalService;

    private String getCartIdFromCookies(HttpServletRequest request) {
        // Try to get from cookie header first
        String cookieHeader = request.getHeader(HttpHeaders.COOKIE);
        log.info("Cookie header: {}", cookieHeader);
        
        if (cookieHeader != null) {
            String[] cookies = cookieHeader.split(";");
            for (String cookie : cookies) {
                cookie = cookie.trim();
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
                if ("cartId".equals(cookie.getName())) {
                    log.info("Found cartId in cookies array: {}", cookie.getValue());
                    return cookie.getValue();
                }
            }
        }
        
        return null;
    }
    
    @PostMapping("{userId}")
    public ResponseEntity<Order> saveOrder(
            @PathVariable("userId") Long userId,
            HttpServletRequest request) {
        
        String cartId = getCartIdFromCookies(request);
        log.info("Processing order for userId: {} with cartId: {}", userId, cartId);
        
        if (cartId == null) {
            log.error("No cartId found in cookies");
            return ResponseEntity.badRequest()
                    .body(null);
        }

        try {
            // Get cart items
            List<Item> cart = cartService.getAllItemsFromCart(cartId);
            if (cart == null || cart.isEmpty()) {
                log.error("Cart is empty for cartId: {}", cartId);
                return ResponseEntity.badRequest()
                        .body(null);
            }

            // Create order
            Order order = new Order();
            ResponseEntity<User> userResponse = userClient.getUserById(userId);
            if (userResponse.getStatusCode() != HttpStatus.OK || userResponse.getBody() == null) {
                log.error("User not found for userId: {}", userId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(null);
            }
            User user = userResponse.getBody();
            
            order.setUser(user);
            order.setOrderedDate(LocalDate.now());
            order.setStatus("PENDING");
            order.setTotal(OrderUtilities.countTotalPrice(cart));
            order.setItems(cart);

            // Save order
            order = orderService.saveOrder(order);
            log.info("Order created successfully with ID: {}", order.getId());

            // Clear cart after successful order
            cartService.deleteCart(cartId);
            log.info("Cart cleared after successful order");

            return ResponseEntity.status(HttpStatus.CREATED)
                    .headers(headerGenerator.getHeadersForSuccessPostMethod(request, order.getId()))
                    .body(order);
        } catch (Exception e) {
            log.error("Error creating order: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }
    
    @PostMapping("/pay/{orderId}")
    public ResponseEntity<PaymentResponse> payment(@PathVariable("orderId") Long orderId) {
        try {
            Optional<Order> orderOpt = orderService.findById(orderId);
            if (!orderOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new PaymentResponse(false, "Không tìm thấy đơn hàng", null));
            }
            Order order = orderOpt.get();

            // Kiểm tra số tiền đơn hàng
            if (order.getTotal() == null || order.getTotal().compareTo(BigDecimal.ZERO) <= 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new PaymentResponse(false, "Số tiền đơn hàng không hợp lệ", null));
            }

            Payment payment = payPalService.createPayment(
                order.getTotal(), 
                "VND",  // Chỉ định rõ tiền VND để được chuyển đổi 
                "paypal",
                "sale",
                "Payment for Order #" + orderId,
                "http://localhost:3000/payment/cancel",
                "http://localhost:3000/payment/success"
            );
            
            for(Links links : payment.getLinks()){
                if(links.getRel().equals("approval_url")){
                    return ResponseEntity.ok()
                            .headers(headerGenerator.getHeadersForSuccessGetMethod())
                            .body(new PaymentResponse(true, "Payment URL created", links.getHref()));
                }
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new PaymentResponse(false, "Could not create payment URL", null));
        } catch (PayPalRESTException e) {
            log.error("Error occurred: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new PaymentResponse(false, e.getMessage(), null));
        }
    }

    @GetMapping("/success")
    public ResponseEntity<PaymentResponse> successPay(
            @RequestParam("paymentId") String paymentId, 
            @RequestParam("PayerID") String payerId) {
        try {
            Payment payment = payPalService.executePayment(paymentId, payerId);
            if(payment.getState().equals("approved")){
                String description = payment.getTransactions().get(0).getDescription();
                Long orderId = Long.parseLong(description.split("#")[1]);
                
                Optional<Order> orderOpt = orderService.findById(orderId);
                if (!orderOpt.isPresent()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(new PaymentResponse(false, "Order not found", null));
                }
                Order order = orderOpt.get();
                order.setStatus("PAID");
                order = orderService.saveOrder(order);
                
                return ResponseEntity.ok()
                        .headers(headerGenerator.getHeadersForSuccessGetMethod())
                        .body(new PaymentResponse(true, "Payment successful", order));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new PaymentResponse(false, "Payment not approved", null));
        } catch (PayPalRESTException e) {
            log.error("Error occurred: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new PaymentResponse(false, e.getMessage(), null));
        }
    }

    @GetMapping("/cancel")
    public ResponseEntity<PaymentResponse> cancelPay() {
        return ResponseEntity.ok()
                .headers(headerGenerator.getHeadersForSuccessGetMethod())
                .body(new PaymentResponse(false, "Payment cancelled by user", null));
    }

    @GetMapping("")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.findAllOrders();
        if (!orders.isEmpty()) {
            return ResponseEntity.ok()
                    .headers(headerGenerator.getHeadersForSuccessGetMethod())
                    .body(orders);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .headers(headerGenerator.getHeadersForError())
                .body(null);
    }

    @GetMapping("{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable("orderId") Long orderId) {
        return orderService.findById(orderId)
                .map(order -> ResponseEntity.ok()
                        .headers(headerGenerator.getHeadersForSuccessGetMethod())
                        .body(order))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .headers(headerGenerator.getHeadersForError())
                        .body(null));
    }

    @GetMapping("user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUserId(@PathVariable("userId") Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        log.info("User retrieved: {}", user);
        
        if (user != null) {
            List<Order> orders = user.getOrders();
            log.info("Orders for user {}: {}", userId, orders);
            return ResponseEntity.ok()
                    .headers(headerGenerator.getHeadersForSuccessGetMethod())
                    .body(orders);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .headers(headerGenerator.getHeadersForError())
                .body(null);
    }
   @GetMapping("/user")
   public ResponseEntity<OrderResponse> getOrdersByUserName(@RequestParam("name") String userName) {
    log.info("Tìm đơn hàng cho user: {}", userName);
    
    List<User> users = userRepository.findByUserName(userName);
    
    if (users.size() == 1) {
        User user = users.get(0);
        List<Order> orders = user.getOrders();
        log.info("Tìm thấy user: {}. Số lượng đơn hàng: {}", userName, orders != null ? orders.size() : 0);
        
        return ResponseEntity.ok()
                .body(new OrderResponse(true,
                    String.format("Đã tìm thấy %d đơn hàng của người dùng %s", orders.size(), userName),
                    orders));
    } else if (users.isEmpty()) {
        log.warn("Không tìm thấy user: {}", userName);
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .headers(headerGenerator.getHeadersForError())
                .body(new OrderResponse(false,
                    String.format("Không tìm thấy người dùng %s", userName),
                    null));
    } else {
        List<Order> allOrders = new ArrayList<>();
        for (User user : users) {
            allOrders.addAll(user.getOrders());
        }
        log.info("Có nhiều người dùng trùng tên: {}. Tổng số đơn hàng: {}", userName, allOrders.size());
        
        return ResponseEntity.ok()
                .body(new OrderResponse(true,
                    String.format("Đã tìm thấy %d đơn hàng cho những người dùng với tên %s", allOrders.size(), userName),
                    allOrders));
    }
}
}

class PaymentResponse {
    private boolean success;
    private String message;
    private Object data;

    public PaymentResponse(boolean success, String message, Object data) {
        this.success = success;
        this.message = message;
        this.data = data;
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

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}

class OrderResponse {
    private boolean success;
    private String message;
    private Object data;

    public OrderResponse(boolean success, String message, Object data) {
        this.success = success;
        this.message = message;
        this.data = data;
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

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}
