package org.example.models.user;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.example.models.events.*;
import org.example.models.subscriptions.*;
import org.example.models.tags.Tag;
import java.util.List;


@Data
@ToString(exclude = "events")
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

    @JsonIgnore
    @Column(nullable = false)
    private String pass;

    private String avatar;

    @Column(unique = true)
    private String token;

    @ManyToMany
    @JoinTable(name = "user_tags",
               joinColumns = @JoinColumn(name = "user_id"),
               inverseJoinColumns = @JoinColumn(name = "tag_id"))
    private List<Tag> tags;

    @JsonIgnore
    @ManyToMany
    @JoinTable(name = "event_subscriptions",
               joinColumns = @JoinColumn(name = "user_id"),
               inverseJoinColumns = @JoinColumn(name = "event_id"))
    private List<CustomEvent> events;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status = UserStatus.GUEST;
}
