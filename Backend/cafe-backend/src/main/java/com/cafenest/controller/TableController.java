package com.cafenest.controller;

import com.cafenest.model.Table;
import com.cafenest.model.User;
import com.cafenest.repository.TableRepository;
import com.cafenest.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
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
    private TableRepository tableRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public List<Table> getTables(HttpServletRequest request) {
        User user = jwtUtil.getUserFromRequest(request);
        return tableRepository.findByUserId(user.getId());
    }

    @PostMapping
    public Table createTable(@RequestBody Table table, HttpServletRequest request) {
        User user = jwtUtil.getUserFromRequest(request);
        table.setUserId(user.getId());
        return tableRepository.save(table);
    }

    @PutMapping("/{id}")
    public Table updateTable(@PathVariable Long id, @RequestBody Table tableDetails, HttpServletRequest request) {
        User user = jwtUtil.getUserFromRequest(request);
        Optional<Table> optional = tableRepository.findById(id);
        if (!optional.isPresent()) {
            throw new RuntimeException("Table not found");
        }
        Table existing = optional.get();
        if (!existing.getUserId().equals(user.getId())) {
            throw new RuntimeException("Not authorized");
        }
        if (tableDetails.getTableNumber() != null) existing.setTableNumber(tableDetails.getTableNumber());
        if (tableDetails.getSeatingCapacity() != null) existing.setSeatingCapacity(tableDetails.getSeatingCapacity());
        return tableRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    public void deleteTable(@PathVariable Long id, HttpServletRequest request) {
        User user = jwtUtil.getUserFromRequest(request);
        Optional<Table> optional = tableRepository.findById(id);
        if (!optional.isPresent() || !optional.get().getUserId().equals(user.getId())) {
            throw new RuntimeException("Not found or not authorized");
        }
        tableRepository.deleteById(id);
    }
}