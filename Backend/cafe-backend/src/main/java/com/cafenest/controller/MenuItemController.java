package com.cafenest.controller;

import com.cafenest.model.MenuItem;
import com.cafenest.model.User;
import com.cafenest.repository.MenuRepository;
import com.cafenest.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/menu")
@CrossOrigin(origins = {
    "https://cafenest.shop",
    "https://www.cafenest.shop",
    "https://cafenest.onrender.com",
    "http://localhost:3000",
    "http://localhost:5500"
})
public class MenuItemController {

    @Autowired
    private MenuRepository menuItemRepository;

    @Autowired
    private MenuRepository menuRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public List<MenuItem> getAll(HttpServletRequest request) {
        User user = jwtUtil.getUserFromRequest(request);
        return menuItemRepository.findByUserId(user.getId());
    }

    @PostMapping
    public MenuItem add(@RequestBody MenuItem item, HttpServletRequest request) {
        User user = jwtUtil.getUserFromRequest(request);
        item.setUserId(user.getId());
        return menuItemRepository.save(item);
    }

    @PutMapping("/{id}")
    public MenuItem update(@PathVariable Long id, @RequestBody MenuItem item, HttpServletRequest request) {
        User user = jwtUtil.getUserFromRequest(request);
        MenuItem existing = menuItemRepository.findById(id).orElse(null);
        if (existing == null || !existing.getUserId().equals(user.getId())) {
            throw new RuntimeException("Not found or not authorized");
        }
        item.setId(id);
        item.setUserId(user.getId());
        return menuItemRepository.save(item);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, HttpServletRequest request) {
        User user = jwtUtil.getUserFromRequest(request);
        MenuItem existing = menuItemRepository.findById(id).orElse(null);
        if (existing == null || !existing.getUserId().equals(user.getId())) {
            throw new RuntimeException("Not found or not authorized");
        }
        menuItemRepository.deleteById(id);
    }

    @GetMapping("/menus")
    public List<MenuItem> getMenus(HttpServletRequest request) {
        User user = jwtUtil.getUserFromRequest(request);
        return menuRepository.findByUserId(user.getId());
    }

    @PostMapping("/menus")
    public MenuItem createMenu(@RequestBody MenuItem menu, HttpServletRequest request) {
        User user = jwtUtil.getUserFromRequest(request);
        menu.setUserId(user.getId());
        return menuRepository.save(menu);
    }
}