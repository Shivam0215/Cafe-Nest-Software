package com.cafenest.repository;

import com.cafenest.model.Table;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TableRepository extends JpaRepository<Table, Long> {
    List<Table> findByUserId(Long userId); // Add this method
}