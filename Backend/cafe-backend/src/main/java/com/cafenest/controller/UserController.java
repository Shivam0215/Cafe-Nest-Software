package com.cafenest.controller;

import com.cafenest.model.User;
import com.cafenest.model.LoginRequest;
import com.cafenest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.ResponseEntity;
import com.cafenest.security.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import org.springframework.validation.BindingResult;

import javax.validation.Valid;

// @CrossOrigin(origins = {"https://cafenest.shop", "https://www.cafenest.shop",  "https://cafenest.onrender.com"})
@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody User user, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(result.getAllErrors().get(0).getDefaultMessage());
        }
        Optional<User> existing = userRepository.findByEmail(user.getEmail());
        if (existing.isPresent()) {
            return ResponseEntity.status(400).body("Email already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return ResponseEntity.ok(userRepository.save(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Optional<User> optionalUser = userRepository.findByEmail(loginRequest.getEmail());
            if (optionalUser.isPresent() && passwordEncoder.matches(loginRequest.getPassword(), optionalUser.get().getPassword())) {
                User user = optionalUser.get();
                String token = jwtUtil.generateToken(user.getEmail());
                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                // Only send safe user info (no password)
                Map<String, Object> userInfo = new HashMap<>();
                userInfo.put("id", user.getId());
                userInfo.put("name", user.getName());
                userInfo.put("email", user.getEmail());
                response.put("user", userInfo);
                return ResponseEntity.ok(response);
            }
            return ResponseEntity.status(401).body("Invalid credentials");
        } catch (Exception e) {
            e.printStackTrace(); // This will print the error to logs
            return ResponseEntity.status(500).body("An error occurred. Please try again later.");
        }
    }
    @PutMapping("/profile")
public ResponseEntity<?> updateProfile(@RequestBody User updatedUser, HttpServletRequest request) {
    User currentUser = jwtUtil.getUserFromRequest(request);
    if (currentUser == null) {
        return ResponseEntity.status(401).body("Unauthorized");
    }

    // Update allowed fields only
    currentUser.setName(updatedUser.getName());
    currentUser.setCafeName(updatedUser.getCafeName());
    currentUser.setProfilePhoto(updatedUser.getProfilePhoto());
    currentUser.setCompanyName(updatedUser.getCompanyName());

    userRepository.save(currentUser);

    // Exclude password before sending
    currentUser.setPassword(null);

    return ResponseEntity.ok(currentUser);
}

}

