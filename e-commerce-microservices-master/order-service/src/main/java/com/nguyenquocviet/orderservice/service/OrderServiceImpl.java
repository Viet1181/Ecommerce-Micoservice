package com.nguyenquocviet.orderservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.jpa.EntityManagerFactoryUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nguyenquocviet.orderservice.domain.Item;
import com.nguyenquocviet.orderservice.domain.Order;
import com.nguyenquocviet.orderservice.domain.Product;
import com.nguyenquocviet.orderservice.repository.OrderRepository;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;
import java.util.Optional;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public Order saveOrder(Order order) {
        System.out.println("Saving order: " + order);
        
        if (order.getItems() != null) {
            for (Item item : order.getItems()) {
                // First persist/merge the Product
                if (item.getProduct() != null) {
                    Product managedProduct = entityManager.merge(item.getProduct());
                    item.setProduct(managedProduct);
                }
                
                // Now persist/merge the Item itself
                Item managedItem = entityManager.merge(item);
                
                // Clear and re-add the managed items to ensure proper persistence
                order.getItems().clear();
                order.getItems().add(managedItem);
            }
        }
        
        return orderRepository.save(order);
    }

    @Override
    public List<Order> findAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public Optional<Order> findById(Long id) {
        return orderRepository.findById(id);
    }
}
