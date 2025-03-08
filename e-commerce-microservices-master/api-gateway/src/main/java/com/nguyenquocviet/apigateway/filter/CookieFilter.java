package com.nguyenquocviet.apigateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpCookie;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class CookieFilter implements GlobalFilter, Ordered {

    private static final Logger log = LoggerFactory.getLogger(CookieFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        MultiValueMap<String, String> cookies = request.getQueryParams();
        MultiValueMap<String, HttpCookie> requestCookies = request.getCookies();
        
        String cartId = null;
        
        // Try to get cartId from cookies first
        if (requestCookies.containsKey("cartId")) {
            cartId = requestCookies.getFirst("cartId").getValue();
        }
        
        // If not in cookies, try query params
        if (cartId == null && cookies.containsKey("cartId")) {
            cartId = cookies.getFirst("cartId");
        }
    
        if (cartId != null) {
            log.info("CookieFilter - Found cartId: {}", cartId);
            
            // Get existing cookie header without brackets
            List<String> existingCookies = request.getHeaders().get(HttpHeaders.COOKIE);
            String cookieHeader = existingCookies != null && !existingCookies.isEmpty() 
                ? existingCookies.get(0) + "; cartId=" + cartId
                : "cartId=" + cartId;
                
            // Create a new request with combined cookies
            ServerHttpRequest modifiedRequest = request.mutate()
                .header(HttpHeaders.COOKIE, cookieHeader)
                .build();
                    
            log.info("CookieFilter - Forwarding request with Cookie header: {}", cookieHeader);
            return chain.filter(exchange.mutate().request(modifiedRequest).build());
        }
    
        return chain.filter(exchange);
    }
    
    @Override
    public int getOrder() {
        return 0;
    }
}