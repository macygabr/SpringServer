package org.example.repositories;

import org.example.models.events.*;
import org.example.models.subscriptions.*;
import org.example.models.user.*;

import org.example.repositories.*;
import org.example.models.tags.*;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface TagRepository extends JpaRepository<Tag, Long> {
    Optional<Tag> findByCalendarURL(String calendarURL);
}