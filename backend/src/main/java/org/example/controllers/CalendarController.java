package org.example.controllers;

import org.example.models.events.*;
import org.example.models.subscriptions.*;
import org.example.models.user.*;

import org.example.repositories.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.stream.Collectors;
import org.example.models.tags.Tag;
import org.springframework.http.HttpStatus;
import java.util.List;

@RestController
@RequestMapping("/calendar")
public class CalendarController {
    String url;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final EventSubscriptionRepository eventSubscriptionRepository;
    private final TagRepository tagRepository;

    @Autowired
    public CalendarController(UserRepository userRepository, EventRepository eventRepository, EventSubscriptionRepository eventSubscriptionRepository, TagRepository tagRepository) {
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.eventSubscriptionRepository = eventSubscriptionRepository;
        this.tagRepository = tagRepository;
    }

@GetMapping("/get")
public ResponseEntity<?> get(@RequestHeader("Authorization") String token) {

    User user = userRepository.findByToken(token).orElse(null);
    if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");

    List<Tag> tags = user.getTags();
    List<String> srcList = tags.stream()
                               .map(Tag::getSrc)
                               .collect(Collectors.toList());
        return ResponseEntity.ok(srcList);
    }
}
