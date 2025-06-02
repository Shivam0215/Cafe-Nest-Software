package com.cafenest.repository;

import com.cafenest.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    List<Employee> findByUserId(Long userId); // Add this method
}