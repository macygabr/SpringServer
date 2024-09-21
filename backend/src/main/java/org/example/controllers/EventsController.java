package org.example.controllers;

import org.example.service.GoogleCalendarService;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;
import com.google.api.client.util.DateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;

import org.example.models.events.*;
import org.example.models.subscriptions.*;
import org.example.models.user.*;
import org.example.models.tags.*;

import org.example.repositories.*;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;

@RestController
@RequestMapping("/events")
public class EventsController {
    private final GoogleCalendarService googleCalendarService;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final EventSubscriptionRepository eventSubscriptionRepository;
    private final TagRepository tagRepository;

    @Autowired
    public EventsController(GoogleCalendarService googleCalendarService, EventRepository eventRepository, UserRepository userRepository, EventSubscriptionRepository eventSubscriptionRepository, TagRepository tagRepository) {
        this.googleCalendarService = googleCalendarService;
        this.eventSubscriptionRepository = eventSubscriptionRepository;
        this.eventRepository=eventRepository;
        this.userRepository=userRepository;
        this.tagRepository = tagRepository;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createEvent(@RequestHeader("Authorization") String token, @RequestBody Map<String, String> body) {
        try {
            System.out.println("\033[33m events/create: " + "start(body): "+body+ "\033[0m");

            Optional<User> users = userRepository.findByToken(token);
            if(!users.isPresent()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid tokens");
            
            String summary = body.get("title");
            String description = body.get("description");
            String location = body.get("location_address");

            String start_time = body.get("start") + ":00";
            String end_time = body.get("end") +":00";

            Event event =  new Event()
                    .setSummary(summary)
                    .setLocation(location)
                    .setDescription(description);

                EventDateTime start = new EventDateTime()
                    .setDateTime(new DateTime(start_time))
                    .setTimeZone("Asia/Novosibirsk");
                event.setStart(start);

                EventDateTime end = new EventDateTime()
                    .setDateTime(new DateTime(end_time))
                    .setTimeZone("Asia/Novosibirsk");
                event.setEnd(end);

            Optional<Tag> tag = tagRepository.findById(Long.parseLong(body.get("tag")));
            if(!tag.isPresent()) return ResponseEntity.status(500).body("Error creating event");

            String calendarURL = tag.get().getCalendarURL();
            String eventId  = googleCalendarService.createEvent(calendarURL, event);
            System.out.println("\033[32m events/create: " + "create event(eventId): "+eventId + " calendarURL: " + calendarURL+ "\033[0m");
            String subscribeUrl = subscribeUrl(eventId, calendarURL);
            String updatedDescription = event.getDescription() + "<a href=\"" +subscribeUrl+ "\">Подписаться на событие</a>";
            event.setDescription(updatedDescription);
            googleCalendarService.updateEvent(calendarURL, eventId, event);


            CustomEvent customEvent = new CustomEvent();
            customEvent.setTitle(summary);
            customEvent.setDescription(description);
            customEvent.setLocation(location);
            customEvent.setEventId(eventId);
            customEvent.setTag(tag.get());
            customEvent.setOrganizer(users.get());
            eventRepository.save(customEvent);

            EventSubscription eventSubscription = new EventSubscription();
            eventSubscription.setCustomEvent(customEvent);
            eventSubscription.setUser(users.get());
            eventSubscriptionRepository.save(eventSubscription);

            return ResponseEntity.ok("Event created");
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("\033[31m events/create: " + "status: fail\033[0m");
            return ResponseEntity.status(500).body("Error creating event");
        }
    }

    @PostMapping("/delete")
    public ResponseEntity<?> deleteEvent(@RequestBody List<String> body) {
        try {
            for(String eventId : body) {
                // if()
                System.out.println("\033[33m events/delete: " + "start(eventId): "+eventId+ "\033[0m");
                googleCalendarService.deleteEvent(eventId);
            }
            return ResponseEntity.ok("Event deleted");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error deleting event");
        }
    }

    @PostMapping("/getall")
    public ResponseEntity<?> getAll(@RequestHeader("Authorization") String token) {
        try {
            System.out.println("\033[33m events/getAll: " + "start(token): "+token+ "\033[0m");
            Optional<User> users = userRepository.findByToken(token);
            if(!users.isPresent()) {
                return ResponseEntity.status(401).body("Invalid token");
            }
            User user = users.get();
            List<EventSubscription> subscriptions = eventSubscriptionRepository.findAllByUser(user);
            
            List<CustomEvent> customEvents = subscriptions.stream()
                .map(EventSubscription::getCustomEvent)
                .collect(Collectors.toList());
            System.out.println("\033[33m events/getAll: " + "finish(customEvents): "+customEvents+ "\033[0m");
            return ResponseEntity.ok(customEvents);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error");
        }
    }

    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(@RequestHeader("Authorization") String token, @RequestBody Map<String, String> body) {
        try {
            System.out.println("\033[33m auth/subscribe: " + "start\033[0m");
            String eventId = body.get("eventId");
            synchronized (this) {
                Optional<User> users = userRepository.findByToken(token);
                if(!users.isPresent()) {
                    return ResponseEntity.status(401).body("Invalid token");
                }
    
                List<CustomEvent> events = users.get().getEvents();
                System.out.println("\033[33m auth/subscribe: " + "finish(events): "+events+ "\033[0m");
                for(CustomEvent event : events) {
                    if(event.getEventId().equals(eventId)) {
                        return ResponseEntity.status(400).body("Already subscribed");
                    }
                }
    
                EventSubscription eventSubscription = new EventSubscription();
                eventSubscription.setUser(users.get());
                eventSubscription.setCustomEvent(eventRepository.findByEventId(eventId).get());
                eventSubscriptionRepository.save(eventSubscription);
            }

            System.out.println("\033[32m auth/subscribe: " + "finish(eventId): "+eventId+ "\033[0m");
            return ResponseEntity.ok("Event subscribed");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error");
        }
    }

    private Event parseEvent(Map<String, String> body) {
        String summary = body.get("title");
        String description = body.get("description");
        String location = body.get("location_address");

        String start_time = body.get("start") + ":00";
        String end_time = body.get("end") +":00";

        Event event =  new Event()
                .setSummary(summary)
                .setLocation(location)
                .setDescription(description);

            EventDateTime start = new EventDateTime()
                .setDateTime(new DateTime(start_time))
                .setTimeZone("Asia/Novosibirsk");
            event.setStart(start);

            EventDateTime end = new EventDateTime()
                .setDateTime(new DateTime(end_time))
                .setTimeZone("Asia/Novosibirsk");
            event.setEnd(end);

        return event;
    }
    private String subscribeUrl(String eventId, String calendarURL) {
        return "http://37.194.168.90:3000/auth/subscribe?eventId=" + eventId;
    }
}