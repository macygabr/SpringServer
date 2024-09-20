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

    @Value("${google.calendar.marketplace}")
    private String marketplace;

    @Value("${google.calendar.invest_club}")
    private String investClub;

    @Value("${google.calendar.sport_club}")
    private String sportClub;

    @Value("${google.calendar.reading_club}")
    private String readingClub;

    @Value("${google.calendar.charity}")
    private String charity;

    @Value("${google.calendar.english_club}")
    private String englishClub;

    @Value("${google.calendar.production}")
    private String production;

    @Value("${google.calendar.parent_council}")
    private String parentCouncil;

    private Map<String, String> calendarMap;

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

    @PostConstruct
    public void initCalendarMap() {
        try {
            calendarMap = new HashMap<>();
            calendarMap.put("marketplace", marketplace);
            calendarMap.put("investClub", investClub);
            calendarMap.put("sportClub", sportClub);
            calendarMap.put("readingClub", readingClub);
            calendarMap.put("charity", charity);
            calendarMap.put("englishClub", englishClub);
            calendarMap.put("production", production);
            calendarMap.put("parentCouncil", parentCouncil);

            calendarMap.entrySet().stream()
            .forEach(entry -> {
                Tag tag = new Tag();
                tag.setCalendarURL(entry.getValue());
                tag.setName(entry.getKey());
                tagRepository.save(tag);
            });
        } catch(Exception e) {
            System.err.println(e.getMessage());
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createEvent(@RequestHeader("Authorization") String token, @RequestBody Map<String, String> body) {
        try {
            System.out.println("\033[33m events/create: " + "start(body): "+body+ "\033[0m");

            Optional<User> users = userRepository.findByToken(token);
            if(!users.isPresent()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid tokens");

            Event event = new Event()
                .setSummary("Ваше событие")
                .setLocation("Место")
                .setDescription("Описание события");

            EventDateTime start = new EventDateTime()
                .setDateTime(new DateTime("2024-09-20T13:00:00+07:00"))
                .setTimeZone("Asia/Novosibirsk");
            event.setStart(start);

            EventDateTime end = new EventDateTime()
                .setDateTime(new DateTime("2024-09-20T14:00:00+07:00"))
                .setTimeZone("Asia/Novosibirsk");
            event.setEnd(end);

            String calendarId = calendarMap.get("marketplace");
            String eventId  = googleCalendarService.createEvent(calendarId, event);
            System.out.println("\033[32m events/create: " + "create event(eventId): "+eventId + " calendarId: " + calendarId+ "\033[0m");

            Optional<Tag> tag = tagRepository.findByCalendarURL(calendarId);
            if(!tag.isPresent()) return ResponseEntity.status(500).body("Error creating event");

            CustomEvent customEvent = new CustomEvent();
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
    public ResponseEntity<?> deleteEvent(@RequestBody Map<String, String> body) {
        try {
            System.out.println("\033[33m events/delete: " + "start(body): "+body+ "\033[0m");
            String eventId = body.get("eventId");
            googleCalendarService.deleteEvent(eventId);
            return ResponseEntity.ok("Event deleted");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error deleting event");
        }
    }

    @GetMapping("/getAll")
    public ResponseEntity<?> getAll(@RequestHeader("Authorization") String token, @RequestBody Map<String, String> body) {
        try {
            System.out.println("\033[33m events/getAll: " + "start(body): "+body+ "\033[0m");

            Optional<User> users = userRepository.findByToken(token);
            if(!users.isPresent()) {
                return ResponseEntity.status(401).body("Invalid token");
            }

            User user = users.get();
            List<EventSubscription> subscriptions = eventSubscriptionRepository.findAllByUser(user);
            
            List<CustomEvent> customEvents = subscriptions.stream()
                .map(EventSubscription::getCustomEvent)
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(customEvents);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error");
        }
    }
}