package org.example.controllers;


import java.util.Optional;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.Cookie;

import org.example.repositories.UserRepository;
import org.example.models.User;
import java.util.UUID;

@RestController
public class LogoutController {
    
    private final UserRepository userRepository;

    @Autowired
    public LogoutController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/logout")
    public ResponseEntity<?> LogOut(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        String cookieValue = null;
        if (cookies != null) {
        for (Cookie cookie : cookies) {
                if (cookie.getName().equals("macygabr")) cookieValue = cookie.getValue();
            }
        }

        Optional<User> users = userRepository.findByCookie(cookieValue);
         if (users.isPresent()) {
                User user = users.get();
                user.setCookie(null);
                userRepository.save(user);
                return ResponseEntity.ok().body("Logout success");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not found user");
            }
        }
}