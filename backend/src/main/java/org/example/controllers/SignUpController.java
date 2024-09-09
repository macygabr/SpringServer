package org.example.controllers;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import org.example.service.EmailService;
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
public class SignUpController {
    
    private final UserRepository userRepository;
    private EmailService emailService;

    @Autowired
    public SignUpController(UserRepository userRepository, EmailService emailService) {
        this.emailService = emailService;
        this.userRepository = userRepository;
    }

    @PostMapping("/signUp")
    public ResponseEntity<?> SignUp(@RequestBody SignUpRequest signUpRequest) {
        System.out.println("\033[34m"+signUpRequest + "\033[0m");
        
        if(userRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User already exists");
        }
        
        emailService.setFirstName(signUpRequest.getFirstName());
        emailService.setLastName(signUpRequest.getLastName());
        emailService.setEmail(signUpRequest.getEmail());
        emailService.setPassword(signUpRequest.getPassword());

        emailService.sendConfirmationEmail();
        return ResponseEntity.ok().body("Success");
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SignUpRequest {
        private String firstName;
        private String lastName;
        private String email;
        private String password;
    }
}