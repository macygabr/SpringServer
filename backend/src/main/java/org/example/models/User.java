package org.example.models;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;
    private String pass;
    private String avatar;

    @Column(unique = true)
    private String cookie;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_auth_info_id")
    @JsonIgnore 
    private UserAuthInfo userAuthInfo;
}