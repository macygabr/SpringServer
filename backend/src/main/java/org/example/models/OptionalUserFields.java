package org.example.models;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Entity
@Table(name = "optional_user_fields")
public class OptionalUserFields {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String jobTitle;
    private String country;
    private String city;
    private String timezone;

    @OneToOne(mappedBy = "optionalUserFields")
    @JsonIgnore
    private User user;
}