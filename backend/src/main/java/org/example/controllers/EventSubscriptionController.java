package org.example.controllers;

import org.example.models.events.*;
import org.example.models.subscriptions.*;
import org.example.models.user.*;

import org.example.repositories.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/subscriptions")
public class EventSubscriptionController {

    @Autowired
    private EventSubscriptionRepository eventSubscriptionRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

}
