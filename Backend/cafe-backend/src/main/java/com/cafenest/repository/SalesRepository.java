package com.cafenest.repository;

import com.cafenest.model.Sale;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SalesRepository extends JpaRepository<Sale, Long> {
    List<Sale> findByUserId(Long userId); // Add this method
}