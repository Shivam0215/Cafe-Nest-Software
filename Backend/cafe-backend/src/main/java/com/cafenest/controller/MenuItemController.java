package com.cafenest.controller;

import com.cafenest.model.MenuItem;
import com.cafenest.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
public class MenuItemController {
    @Autowired
    private MenuItemRepository menuItemRepository;

    @GetMapping
    public List<MenuItem> getAll() { return menuItemRepository.findAll(); }

    @PostMapping
    public MenuItem add(@RequestBody MenuItem item) { return menuItemRepository.save(item); }

    @PutMapping("/{id}")
    public MenuItem update(@PathVariable Long id, @RequestBody MenuItem item) {
        item.setId(id);
        return menuItemRepository.save(item);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { menuItemRepository.deleteById(id); }
}