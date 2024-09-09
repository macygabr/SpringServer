package org.example.controllers;

import java.util.Optional;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.Cookie;

import org.example.repositories.UserRepository;
import org.example.models.User;
import java.util.UUID;

@RestController
public class ProfileController {
    
    private final UserRepository userRepository;

    @Autowired
    public ProfileController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/profile")
    public ResponseEntity<?> MyAccount(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        String cookieValue = null;
        if (cookies != null) {
        for (Cookie cookie : cookies) {
                if (cookie.getName().equals("macygabr")) cookieValue = cookie.getValue();
            }
        }

        Optional<User> user = userRepository.findByCookie(cookieValue);

        if (cookieValue == null || !user.isPresent()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid cookies");
        }

        return ResponseEntity.ok(user.get());
    }
}