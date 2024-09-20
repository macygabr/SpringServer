package org.example.repositories;

import org.example.models.events.*;
import org.example.models.subscriptions.*;
import org.example.models.user.*;

import org.example.repositories.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EventRepository extends JpaRepository<CustomEvent, Long> {
    // List<CustomEvent> findByOrganizerId(Long organizerId);
}
