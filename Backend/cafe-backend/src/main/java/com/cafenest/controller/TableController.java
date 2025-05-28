package com.cafenest.controller;

import com.cafenest.model.TableEntity;
import com.cafenest.repository.TableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tables")
@CrossOrigin(origins = {
    "https://cafenest.shop",
    "https://www.cafenest.shop",
    "https://cafenest.onrender.com",
    "http://localhost:3000",
    "http://localhost:5500"
})
public class TableController {
    @Autowired
    private TableRepository repo;

    @GetMapping
    public List<TableEntity> getAll() { return repo.findAll(); }

    @PostMapping
    public TableEntity add(@RequestBody TableEntity t) { return repo.save(t); }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { repo.deleteById(id); }

    // ADD THIS FOR UPDATE SUPPORT
    @PutMapping("/{id}")
    public TableEntity update(@PathVariable Long id, @RequestBody TableEntity t) {
        Optional<TableEntity> optional = repo.findById(id);
        if (optional.isPresent()) {
            TableEntity existing = optional.get();
            if (t.getTableNumber() != null) existing.setTableNumber(t.getTableNumber());
            if (t.getSeatingCapacity() != null) existing.setSeatingCapacity(t.getSeatingCapacity());
            return repo.save(existing);
        }
        throw new RuntimeException("Table not found");
    }
}