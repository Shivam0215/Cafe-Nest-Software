package com.cafenest.controller;

import com.cafenest.model.Order;
import com.cafenest.model.User;
import com.cafenest.repository.OrderRepository;
import com.cafenest.repository.UserRepository;
import com.cafenest.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

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

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private User getUserFromToken(String authHeader) {
        String token = authHeader.substring(7); // Remove "Bearer "
        String email = jwtUtil.extractEmail(token);
        return userRepository.findByEmail(email).orElse(null);
    }

    @GetMapping
    public ResponseEntity<?> getAll(@RequestHeader("Authorization") String authHeader) {
        User user = getUserFromToken(authHeader);
        List<Order> orders = orderRepository.findByUserId(user.getId());
        return ResponseEntity.ok(orders);
    }

    @PostMapping
    public ResponseEntity<?> add(@RequestBody Order order,
                                 @RequestHeader("Authorization") String authHeader) {
        User user = getUserFromToken(authHeader);
        order.setUser(user);
        return ResponseEntity.ok(orderRepository.save(order));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrder(@PathVariable Long id,
                                      @RequestHeader("Authorization") String authHeader) {
        User user = getUserFromToken(authHeader);
        Order order = orderRepository.findById(id).orElse(null);
        if (order == null || !order.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Access denied");
        }
        return ResponseEntity.ok(order);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrder(@PathVariable Long id,
                                         @RequestBody Order updatedOrder,
                                         @RequestHeader("Authorization") String authHeader) {
        User user = getUserFromToken(authHeader);
        Order existing = orderRepository.findById(id).orElse(null);
        if (existing == null || !existing.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Access denied");
        }
        existing.setCustomerName(updatedOrder.getCustomerName());
        existing.setOrderDetails(updatedOrder.getOrderDetails());
        existing.setOrderStatus(updatedOrder.getOrderStatus());
        existing.setTotalAmount(updatedOrder.getTotalAmount());
        return ResponseEntity.ok(orderRepository.save(existing));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id,
                                         @RequestHeader("Authorization") String authHeader) {
        User user = getUserFromToken(authHeader);
        Order order = orderRepository.findById(id).orElse(null);
        if (order == null || !order.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Access denied");
        }
        orderRepository.delete(order);
        return ResponseEntity.ok("Order deleted");
    }
}
