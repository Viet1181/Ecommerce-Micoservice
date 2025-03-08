package com.nguyenquocviet.orderservice.redis;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.DeserializationFeature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import com.nguyenquocviet.orderservice.domain.Item;

@Repository
public class CartRedisRepositoryImpl implements CartRedisRepository {
    
    @Autowired
    private JedisPool jedisPool;
    
    private final ObjectMapper objectMapper;

    public CartRedisRepositoryImpl() {
        this.objectMapper = new ObjectMapper()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
            .configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false)
            .configure(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true);
    }

    private String getRedisKey(String cartId) {
        return cartId;  // Use cartId directly as the key
    }

    @Override
    public void addItemToCart(String cartId, Object item) {
        if (cartId == null || cartId.trim().isEmpty()) {
            throw new IllegalArgumentException("Cart ID cannot be null or empty");
        }
        
        String key = getRedisKey(cartId);
        try (Jedis jedis = jedisPool.getResource()) {
            String jsonObject = objectMapper.writeValueAsString(item);
            System.out.println("Adding item to cart " + key + ": " + jsonObject);
            jedis.sadd(key, jsonObject);
            System.out.println("Successfully added item to cart " + key);
            
            // Verify the item was added
            Set<String> members = jedis.smembers(key);
            System.out.println("Current cart contents for " + key + ": " + members);
        } catch (JsonProcessingException e) {
            System.err.println("Error adding item to cart: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error adding item to cart", e);
        }
    }

    @Override
    public Collection<Object> getCart(String cartId, Class type) {
        if (cartId == null || cartId.trim().isEmpty()) {
            System.out.println("Cart ID is null or empty");
            return new ArrayList<>();
        }
        
        String key = getRedisKey(cartId);
        List<Object> cart = new ArrayList<>();
        
        try (Jedis jedis = jedisPool.getResource()) {
            System.out.println("Getting cart contents for key: " + key);
            Set<String> members = jedis.smembers(key);
            System.out.println("Redis members for key " + key + ": " + members);
            
            if (members == null || members.isEmpty()) {
                System.out.println("No items found in cart " + key);
                return cart;
            }
            
            for (String jsonItem : members) {
                try {
                    System.out.println("Deserializing item: " + jsonItem);
                    Item item = objectMapper.readValue(jsonItem, Item.class);
                    cart.add(item);
                    System.out.println("Successfully deserialized item: " + item);
                } catch (Exception e) {
                    System.err.println("Error deserializing cart item: " + e.getMessage());
                    System.err.println("Problematic JSON: " + jsonItem);
                    e.printStackTrace();
                    // Continue processing other items even if one fails
                }
            }
            
            System.out.println("Successfully retrieved " + cart.size() + " items from cart " + key);
        }
        return cart;
    }

    @Override
    public void deleteItemFromCart(String cartId, Object item) {
        if (cartId == null || cartId.trim().isEmpty()) {
            throw new IllegalArgumentException("Cart ID cannot be null or empty");
        }
        
        String key = getRedisKey(cartId);
        try (Jedis jedis = jedisPool.getResource()) {
            String jsonObject = objectMapper.writeValueAsString(item);
            jedis.srem(key, jsonObject);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error deleting item from cart", e);
        }
    }

    @Override
    public void deleteCart(String cartId) {
        if (cartId == null || cartId.trim().isEmpty()) {
            throw new IllegalArgumentException("Cart ID cannot be null or empty");
        }
        
        String key = getRedisKey(cartId);
        try (Jedis jedis = jedisPool.getResource()) {
            jedis.del(key);
        }
    }
}
