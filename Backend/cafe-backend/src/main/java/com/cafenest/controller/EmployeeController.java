package com.cafenest.controller;

import com.cafenest.model.Employee;
import com.cafenest.model.User;
import com.cafenest.repository.EmployeeRepository;
import com.cafenest.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = {
        "https://cafenest.shop",
        "https://www.cafenest.shop",
        "https://cafenest.onrender.com",
        "http://localhost:3000",
        "http://localhost:5500"
})
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<?> getEmployees(HttpServletRequest request) {
        User user = jwtUtil.getUserFromRequest(request);
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        List<Employee> employees = employeeRepository.findByUserId(user.getId());
        return ResponseEntity.ok(employees);
    }

    @PostMapping
    public ResponseEntity<?> addEmployee(@RequestBody Employee employee, HttpServletRequest request) {
        User user = jwtUtil.getUserFromRequest(request);
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        employee.setUserId(user.getId());
        Employee saved = employeeRepository.save(employee);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEmployee(@PathVariable Long id, @RequestBody Employee employeeDetails, HttpServletRequest request) {
        User user = jwtUtil.getUserFromRequest(request);
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Optional<Employee> optionalEmployee = employeeRepository.findById(id);
        if (!optionalEmployee.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Employee employee = optionalEmployee.get();
        if (!employee.getUserId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Forbidden");
        }

        employee.setName(employeeDetails.getName());
        employee.setPosition(employeeDetails.getPosition());
        employee.setSalary(employeeDetails.getSalary());
        Employee updated = employeeRepository.save(employee);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable Long id, HttpServletRequest request) {
        User user = jwtUtil.getUserFromRequest(request);
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Optional<Employee> optionalEmployee = employeeRepository.findById(id);
        if (!optionalEmployee.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Employee employee = optionalEmployee.get();
        if (!employee.getUserId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Forbidden");
        }

        employeeRepository.deleteById(id);
        return ResponseEntity.ok().body("Deleted successfully");
    }
}
