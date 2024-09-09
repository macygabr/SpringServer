package org.example.controllers;

import java.util.Optional;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import org.example.repositories.UserRepository;
import org.example.models.User;
import org.example.models.UserAuthInfo;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.Cookie;
import java.util.UUID;

@RestController
public class SignInController {

    private final UserRepository userRepository;

    @Autowired
    public SignInController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/signIn")
    public ResponseEntity<?> signIn(@RequestBody SignInRequest signInRequest, HttpServletRequest request) {
        String email = signInRequest.getEmail();
        String password = signInRequest.getPassword();
        Optional<User> users = userRepository.findByEmail(email);

        if (users.isPresent() && users.get().getPass().equals(password)) {
            User user = users.get();
            String cookieValue = UUID.randomUUID().toString();
            user.setCookie(cookieValue);
            UserAuthInfo userAuthInfo = new UserAuthInfo();
            userAuthInfo.setIp(request.getRemoteAddr());
            userAuthInfo.setUserAgent(request.getHeader("User-Agent"));
            userAuthInfo.setUser(user);
            user.setUserAuthInfo(userAuthInfo);
            userRepository.save(user);
            return ResponseEntity.ok().body(cookieValue);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not found user");
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SignInRequest {
        private String email;
        private String password;
    }
}