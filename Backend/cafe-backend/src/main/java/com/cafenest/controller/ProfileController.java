package com.cafenest.controller;

import com.cafenest.model.User;
import com.cafenest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{userId}")
    public ResponseEntity<User> getProfile(@PathVariable Long userId) {
        return userRepository.findById(userId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{userId}")
    public ResponseEntity<User> updateProfile(@PathVariable Long userId, @RequestBody User updatedUser) {
        return userRepository.findById(userId)
            .map(user -> {
                user.setCompanyName(updatedUser.getCompanyName());
                user.setProfilePhoto(updatedUser.getProfilePhoto());
                // ...update other fields as needed...
                userRepository.save(user);
                return ResponseEntity.ok(user);
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
