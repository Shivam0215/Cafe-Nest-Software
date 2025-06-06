package com.cafenest.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import jakarta.persistence.Column;
import lombok.*;

@Entity
@Table(name = "users")  // Avoids reserved keyword conflict
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
private String cafeName;

// Add fields for profilePhoto and companyName if not present
@Column(length = 100000)
private String profilePhoto;
private String companyName;

@NotBlank
@Email
private String email;

@NotBlank
@Size(min = 8, message = "Password must be at least 8 characters")
private String password;
}
