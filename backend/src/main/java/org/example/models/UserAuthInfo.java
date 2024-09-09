package org.example.models;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Entity
@Table(name = "user_auth_info")
public class UserAuthInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ip;
    private String userAgent;

    @OneToOne(mappedBy = "userAuthInfo")
    @JsonIgnore
    private User user;
}