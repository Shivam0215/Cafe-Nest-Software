package com.cafenest.controller;

import com.cafenest.model.Sale;
import com.cafenest.repository.SalesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
public class SalesController {
    @Autowired
    private SalesRepository repo;

    @GetMapping
    public List<Sale> getAll() { return repo.findAll(); }

    @PostMapping
    public Sale add(@RequestBody Sale s) { return repo.save(s); }
}