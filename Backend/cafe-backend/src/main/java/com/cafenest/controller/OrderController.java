package com.cafenest.controller;

import com.cafenest.model.Order;
import com.cafenest.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = {
    "https://cafenest.shop",
    "https://www.cafenest.shop",
    "https://cafenest.onrender.com",
    "http://localhost:3000",
    "http://localhost:5500"
})
public class OrderController {
    @Autowired
    private OrderRepository orderRepository;

    @GetMapping
    public List<Order> getAll() { return orderRepository.findAll(); }

    @PostMapping
    public Order add(@RequestBody Order order) { return orderRepository.save(order); }

    @GetMapping("/{id}")
    public Order getOrder(@PathVariable Long id) {
        return orderRepository.findById(id).orElseThrow();
    }

    @PutMapping("/{id}")
    public Order updateOrder(@PathVariable Long id, @RequestBody Order order) {
        Order existing = orderRepository.findById(id).orElseThrow();
        existing.setCustomerName(order.getCustomerName());
        existing.setOrderDetails(order.getOrderDetails());
        existing.setOrderStatus(order.getOrderStatus());
        existing.setTotalAmount(order.getTotalAmount());
        return orderRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable Long id) {
        orderRepository.deleteById(id);
    }
}