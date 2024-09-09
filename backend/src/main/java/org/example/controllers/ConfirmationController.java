package org.example.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.example.models.User;
import org.example.models.UserAuthInfo;
import org.example.repositories.UserRepository;
import org.example.service.EmailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class ConfirmationController {

    private EmailService emailService;
    private final UserRepository userRepository;

    @Autowired
    public ConfirmationController(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
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

            // UserAuthInfo userAuthInfo = new UserAuthInfo();
            // userAuthInfo.setIp(emailService.getIp());
            // userAuthInfo.setUserAgent(emailService.getUserAgent());
            // userAuthInfo.setUser(user);
            // user.setUserAuthInfo(userAuthInfo);
            
            userRepository.save(user);
            return ResponseEntity.ok().body(cookieValue);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not found user");
        }
    }
}
