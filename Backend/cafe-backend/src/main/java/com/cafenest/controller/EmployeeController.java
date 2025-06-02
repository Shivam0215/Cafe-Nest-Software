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
    public List<Employee> getEmployees(HttpServletRequest request) {
        User user = jwtUtil.getUserFromRequest(request);
        return employeeRepository.findByUserId(user.getId());
    }

    @PostMapping
    public Employee addEmployee(@RequestBody Employee employee, HttpServletRequest request) {
        User user = jwtUtil.getUserFromRequest(request);
        employee.setUserId(user.getId());
        return employeeRepository.save(employee);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @RequestBody Employee employeeDetails, HttpServletRequest request) {
        User user = jwtUtil.getUserFromRequest(request);
        Optional<Employee> optionalEmployee = employeeRepository.findById(id);
        if (!optionalEmployee.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Employee employee = optionalEmployee.get();
        if (!employee.getUserId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }
        employee.setName(employeeDetails.getName());
        employee.setPosition(employeeDetails.getPosition());
        employee.setSalary(employeeDetails.getSalary());
        return ResponseEntity.ok(employeeRepository.save(employee));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable Long id, HttpServletRequest request) {
        User user = jwtUtil.getUserFromRequest(request);
        Optional<Employee> optionalEmployee = employeeRepository.findById(id);
        if (!optionalEmployee.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Employee employee = optionalEmployee.get();
        if (!employee.getUserId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }
        employeeRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}