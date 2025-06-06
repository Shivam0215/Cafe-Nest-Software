package com.cafenest.model;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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

    // Consider using a @Lob for potentially large data such as profile photo if you store base64 or blob
    @Lob
    @Column(length = 100000)
    private String profilePhoto;

    private String companyName;

    @NotBlank
    @Email
    @Column(unique = true)
    private String email;

    @NotBlank
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    private String role = "USER";  // Default role field, useful for authorization

}
