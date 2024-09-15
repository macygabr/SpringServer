package org.example.controllers;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import org.example.models.User;
import org.example.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.Cookie;
import java.util.List;

@RestController
public class HomeController {

    private final UserRepository userRepository;

    @Autowired
    public HomeController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/home")
    public ResponseEntity<?> home(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        String cookieValue = null;
        if (cookies != null) {
        for (Cookie cookie : cookies) {
                if (cookie.getName().equals("macygabr")) cookieValue = cookie.getValue();
            }
        }

        if (cookieValue == null || !userRepository.findByCookie(cookieValue).isPresent()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid cookies");
        }

        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }
}