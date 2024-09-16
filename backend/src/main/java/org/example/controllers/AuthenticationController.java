package org.example.controllers;

import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

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
@RequestMapping("/auth")
public class AuthenticationController {
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Autowired
    public AuthenticationController(UserRepository userRepository, EmailService emailService) {
        this.emailService = emailService;
        this.userRepository = userRepository;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> SignUp(@RequestBody SignUpRequest signUpRequest) {
        System.out.println("\033[32m signUpRequest: " + signUpRequest.toString() + "\033[0m");
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

    @PostMapping("/signin")
    public ResponseEntity<?> signIn(@RequestBody SignInRequest signInRequest, HttpServletRequest request) {
        String email = signInRequest.getEmail();
        String password = signInRequest.getPassword();
        System.out.println("\033[33m signInRequest(email): " + email + "\033[0m");
        Optional<User> users = userRepository.findByEmail(email);

        if (users.isPresent() && users.get().getPass().equals(password)) {
            User user = users.get();
            Map<String, String> response = generateToken();
            user.setCookie(response.get("token_value"));

            UserAuthInfo userAuthInfo = user.getUserAuthInfo();
            if (userAuthInfo == null) {
                userAuthInfo = new UserAuthInfo();
                userAuthInfo.setUser(user);
            }

            userAuthInfo.setIp(request.getRemoteAddr());
            userAuthInfo.setUserAgent(request.getHeader("User-Agent"));
            user.setUserAuthInfo(userAuthInfo);

            userRepository.save(user);
            return ResponseEntity.ok().body(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not found user");
        }
    }

    @PostMapping("/confirm")
    public ResponseEntity<?> confirmEmail(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        System.out.println("\033[34mconfirm(token): " + token + "\033[0m");
        if(!token.equals(emailService.getToken())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        emailService.setToken(null);
        System.out.println("\033[34mconfirm(status): succses\033[0m");

        try {
            User user = new User();
            user.setFirstName(emailService.getFirstName());
            user.setLastName(emailService.getLastName());
            user.setEmail(emailService.getEmail());
            user.setPass(emailService.getPassword());

            Map<String, String> response = generateToken();
            user.setCookie(response.get("token_value"));

            userRepository.save(user);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not found user");
        }
    }

    private Map<String, String> generateToken() {
         Map<String, String> response = new HashMap<>();
            response.put("token_value", UUID.randomUUID().toString());
            response.put("token_name", "custom-auth-token");
        return response;
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