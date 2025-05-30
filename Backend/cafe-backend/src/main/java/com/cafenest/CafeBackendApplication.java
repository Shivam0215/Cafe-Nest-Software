package com.cafenest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;

import com.cafenest.security.JwtFilter;

@SpringBootApplication
public class CafeBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(CafeBackendApplication.class, args);
    }

    @Bean
    public FilterRegistrationBean<JwtFilter> jwtFilter(JwtFilter filter) {
        FilterRegistrationBean<JwtFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(filter);
        registrationBean.addUrlPatterns("/api/*"); // Protect all /api endpoints
        return registrationBean;
    }
}