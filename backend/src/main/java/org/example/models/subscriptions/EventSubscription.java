package org.example.models.subscriptions;

import jakarta.persistence.*;
import org.example.models.events.*;
import org.example.models.subscriptions.*;
import org.example.models.user.*;

import org.example.repositories.*;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
@Entity
@Table(name = "event_subscriptions")
public class EventSubscription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private CustomEvent customEvent;
}