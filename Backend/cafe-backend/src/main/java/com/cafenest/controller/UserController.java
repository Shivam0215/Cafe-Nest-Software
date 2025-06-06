package com.cafenest.controller;

import com.cafenest.model.User;
import com.cafenest.model.LoginRequest;
import com.cafenest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.ResponseEntity;
import com.cafenest.security.JwtUtil;
import com.cafenest.service.EmailService;

import jakarta.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

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

    @Autowired
private EmailService emailService;


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

    // Generate verification token
    String token = UUID.randomUUID().toString();
    user.setVerificationToken(token);
    user.setVerified(false);

    userRepository.save(user);

    // Send verification email
    emailService.sendVerificationEmail(user.getEmail(), token);

    return ResponseEntity.ok("User registered successfully. Please check your email to verify your account.");
}

    @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
    Optional<User> optionalUser = userRepository.findByEmail(loginRequest.getEmail());
    if (optionalUser.isPresent()) {
        User user = optionalUser.get();
        if (!user.isVerified()) {
            return ResponseEntity.status(403).body("Please verify your email before logging in.");
        }
        if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            String token = jwtUtil.generateToken(user.getEmail());
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("id", user.getId());
            userInfo.put("name", user.getName());
            userInfo.put("email", user.getEmail());
            response.put("user", userInfo);
            return ResponseEntity.ok(response);
        }
    }
    return ResponseEntity.status(401).body("Invalid credentials");
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
@GetMapping("/verify")
public ResponseEntity<?> verifyUser(@RequestParam("token") String token) {
    Optional<User> userOpt = userRepository.findByVerificationToken(token);
    if (userOpt.isPresent()) {
        User user = userOpt.get();
        user.setVerified(true);
        user.setVerificationToken(null); // Clear token once verified
        userRepository.save(user);
        return ResponseEntity.ok("Email verified successfully. You can now login.");
    } else {
        return ResponseEntity.status(400).body("Invalid verification token.");
    }
}



}

