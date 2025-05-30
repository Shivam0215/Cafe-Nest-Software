package com.cafenest.model;

import jakarta.persistence.*;
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
    private String email;
    private String password;
    private String cafeName;

    // Add fields for profilePhoto and companyName if not present
    @Column(length = 100000)
    private String profilePhoto;
    private String companyName;
}
