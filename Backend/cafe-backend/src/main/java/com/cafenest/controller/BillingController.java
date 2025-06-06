package com.cafenest.controller;

import com.cafenest.model.Billing;
import com.cafenest.repository.BillingRepository;
import com.cafenest.security.JwtUtil;
import com.cafenest.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/bills")
@CrossOrigin(origins = {
    "https://cafenest.shop",
    "https://www.cafenest.shop",
    "https://cafenest.onrender.com",
    "http://localhost:3000",
    "http://localhost:5500"
})
public class BillingController {
    @Autowired
    private BillingRepository repo;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public List<Billing> getAll(HttpServletRequest request) {
        User user = jwtUtil.getUserFromRequest(request);
        return repo.findByUserId(user.getId());
    }

    @PostMapping
    public Billing createBill(@RequestBody Billing bill, HttpServletRequest request) {
        User user = jwtUtil.getUserFromRequest(request);
        bill.setUserId(user.getId());
        return repo.save(bill);
    }

    @DeleteMapping("/{id}")
    public void deleteBill(@PathVariable Long id, HttpServletRequest request) {
        User user = jwtUtil.getUserFromRequest(request);
        Billing bill = repo.findById(id).orElse(null);
        if (bill == null || !bill.getUserId().equals(user.getId())) {
            throw new RuntimeException("Not found or not authorized");
        }
        repo.deleteById(id);
    }
}