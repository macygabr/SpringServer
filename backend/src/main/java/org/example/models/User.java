package org.example.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@ToString(exclude = {"userAuthInfo", "optionalUserFields"})
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

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "optional_user_fields")
    @JsonIgnore
    private OptionalUserFields optionalUserFields;

    public void update(User updatedUser) {
        if(updatedUser.getFirstName() != null) {
            this.firstName = updatedUser.getFirstName();
        }
        if(updatedUser.getLastName() != null) {
            this.lastName = updatedUser.getLastName();
        }
        if(updatedUser.getAvatar() != null) {
            this.avatar = updatedUser.getAvatar();
        }
    }
}