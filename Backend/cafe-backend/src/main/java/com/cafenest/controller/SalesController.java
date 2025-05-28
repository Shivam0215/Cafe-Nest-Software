package com.cafenest.controller;

import com.cafenest.model.Sale;
import com.cafenest.repository.SalesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping
    public List<Sale> getAll() { return repo.findAll(); }

    @PostMapping
    public Sale add(@RequestBody Sale s) { return repo.save(s); }
}