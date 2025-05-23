package com.cafenest.controller;

import com.cafenest.model.Billing;
import com.cafenest.repository.BillingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bills")
public class BillingController {
    @Autowired
    private BillingRepository repo;

    @GetMapping
    public List<Billing> getAll() { return repo.findAll(); }

    @PostMapping
    public Billing createBill(@RequestBody Billing bill) {
        bill.setDate(LocalDate.now());
        return repo.save(bill);
    }

    @DeleteMapping("/{id}")
    public void deleteBill(@PathVariable Long id) {
        repo.deleteById(id);
    }
}