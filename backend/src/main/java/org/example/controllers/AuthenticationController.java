package org.example.controllers;

import java.util.Optional;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.models.UserAuthInfo;
import org.example.service.EmailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.beans.factory.annotation.Autowired;

import jakarta.servlet.http.HttpServletRequest;

import org.example.repositories.UserRepository;
import org.example.models.User;

import java.util.UUID;

@RestController
@RequestMapping("/authentication")
public class AuthenticationController {
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Autowired
    public AuthenticationController(UserRepository userRepository, EmailService emailService) {
        this.emailService = emailService;
        this.userRepository = userRepository;
    }

    @PostMapping("/signUp")
    public ResponseEntity<?> SignUp(@RequestBody SignUpRequest signUpRequest) {

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

    @PostMapping("/signIn")
    public ResponseEntity<?> signIn(@RequestBody SignInRequest signInRequest, HttpServletRequest request) {
        String email = signInRequest.getEmail();
        String password = signInRequest.getPassword();
        Optional<User> users = userRepository.findByEmail(email);

        if (users.isPresent() && users.get().getPass().equals(password)) {
            User user = users.get();
            String cookieValue = UUID.randomUUID().toString();
            user.setCookie(cookieValue);

            UserAuthInfo userAuthInfo = user.getUserAuthInfo();
            if (userAuthInfo == null) {
                userAuthInfo = new UserAuthInfo();
                userAuthInfo.setUser(user);
            }

            userAuthInfo.setIp(request.getRemoteAddr());
            userAuthInfo.setUserAgent(request.getHeader("User-Agent"));
            user.setUserAuthInfo(userAuthInfo);

            userRepository.save(user);

            return ResponseEntity.ok().body(cookieValue);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not found user");
        }
    }


    @GetMapping("/confirm")
    public ResponseEntity<?> confirmEmail(@RequestParam("token") String token) {
        if(!token.equals(emailService.getToken())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        try {
            User user = new User();
            user.setFirstName(emailService.getFirstName());
            user.setLastName(emailService.getLastName());
            user.setEmail(emailService.getEmail());
            user.setPass(emailService.getPassword());

            String cookieValue = UUID.randomUUID().toString();
            user.setCookie(cookieValue);

            userRepository.save(user);
            return ResponseEntity.ok().body(cookieValue);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not found user");
        }
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

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SignInRequest {
        private String email;
        private String password;
    }
}