package com.cafenest.repository;

import com.cafenest.model.MenuItem;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MenuRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByUserId(Long userId);
}
