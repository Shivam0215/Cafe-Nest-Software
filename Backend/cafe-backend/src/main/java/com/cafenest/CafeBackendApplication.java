package com.cafenest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.cafenest.security.JwtFilter;
import com.cafenest.security.JwtUtil;

import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class CafeBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(CafeBackendApplication.class, args);
    }

    @Bean
    public JwtFilter jwtFilter(JwtUtil jwtUtil) {
        return new JwtFilter(jwtUtil);
    }
}
