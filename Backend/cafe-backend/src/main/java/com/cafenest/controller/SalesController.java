package com.cafenest.controller;

import com.cafenest.model.Sale;
import com.cafenest.model.User;
import com.cafenest.repository.SalesRepository;
import com.cafenest.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = {
    "https://cafenest.shop",
    "https://www.cafenest.shop",
    "https://cafenest.onrender.com",
    "http://localhost:3000",
    "http://localhost:5500"
})
public class SalesController {
    @Autowired
    private SalesRepository repo;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public List<Map<String, Object>> getAll() {
        return repo.findAll().stream().map(sale -> {
            Map<String, Object> map = new HashMap<>();
            map.put("date", sale.getDate());
            map.put("totalAmount", sale.getSales()); // Map 'sales' to 'totalAmount'
            return map;
        }).collect(Collectors.toList());
    }

    @PostMapping
    public Sale add(@RequestBody Sale s) { return repo.save(s); }

    @GetMapping("/sales")
    public List<Sale> getSales(HttpServletRequest request) {
        User user = jwtUtil.getUserFromRequest(request);
        return repo.findByUserId(user.getId());
    }

    @PostMapping("/sales")
    public Sale createSale(@RequestBody Sale sales, HttpServletRequest request) {
        User user = jwtUtil.getUserFromRequest(request);
        sales.setUserId(user.getId());
        return repo.save(sales);
    }
}