package org.example.models.events;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import org.example.models.user.*;
import org.example.models.tags.Tag;
import java.time.LocalDateTime;

@Data
@ToString
@Entity
@Table(name = "events")
public class CustomEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    @Column(nullable = false, unique = true)
    private String eventId;

    @ManyToOne
    @JoinColumn(name = "tag_id", nullable = false)
    private Tag tag;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User organizer;

    private String location;
}