package com.nguyenquocviet.apigateway;

import com.nguyenquocviet.apigateway.filter.SessionFilter;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpHeaders;
import org.springframework.mock.http.server.reactive.MockServerHttpRequest;
import org.springframework.mock.web.server.MockServerWebExchange;
import org.springframework.web.server.WebSession;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ApiGatewayApplicationTests {

    @Autowired
    private ApplicationContext context;

    @Autowired
    private SessionFilter sessionFilter;

    @Test
    void contextLoads() {
        assertNotNull(context);
    }

    @Test
    void sessionFilterShouldBeGlobalFilter() {
        assertTrue(sessionFilter instanceof GlobalFilter);
    }

    @Test
    void sessionFilterShouldHaveCorrectOrder() {
        assertEquals(10, sessionFilter.getOrder());
    }

    @Test
    void sessionFilterShouldAddSessionIdToCookie() {
        // Create mock exchange
        MockServerHttpRequest request = MockServerHttpRequest
            .get("/test")
            .build();
        MockServerWebExchange exchange = MockServerWebExchange.from(request);

        // Mock session
        WebSession session = exchange.getSession().block();
        assertNotNull(session);
        String sessionId = session.getId();

        // Execute filter
        Mono<Void> result = sessionFilter.filter(exchange, (serverWebExchange) -> Mono.empty());

        // Verify
        StepVerifier.create(result)
            .verifyComplete();

        HttpHeaders headers = exchange.getRequest().getHeaders();
        assertTrue(headers.containsKey(HttpHeaders.COOKIE));
        assertTrue(headers.getFirst(HttpHeaders.COOKIE).contains(sessionId));
    }
}
