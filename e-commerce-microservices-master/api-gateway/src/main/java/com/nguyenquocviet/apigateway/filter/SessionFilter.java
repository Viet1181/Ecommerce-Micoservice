package com.nguyenquocviet.apigateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class SessionFilter implements GlobalFilter, Ordered {

    private static final Logger log = LoggerFactory.getLogger(SessionFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        return exchange.getSession()
            .flatMap(session -> {
                String sessionId = session.getId();
                log.info("Session ID: {}", sessionId);
                
                ServerHttpRequest request = exchange.getRequest();
                List<String> existingCookies = request.getHeaders().get(HttpHeaders.COOKIE);
                String cookieHeader = existingCookies != null && !existingCookies.isEmpty()
                    ? existingCookies.get(0) + "; SESSION=" + sessionId
                    : "SESSION=" + sessionId;
                
                ServerHttpRequest modifiedRequest = request.mutate()
                    .header(HttpHeaders.COOKIE, cookieHeader)
                    .build();
                    
                return chain.filter(exchange.mutate().request(modifiedRequest).build());
            });
    }

    @Override
    public int getOrder() {
        return 10;
    }
}