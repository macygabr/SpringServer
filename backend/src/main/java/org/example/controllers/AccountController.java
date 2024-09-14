package org.example.controllers;

import java.util.Optional;

import jakarta.servlet.http.HttpServletResponse;
import org.example.service.AuthenticationService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.beans.factory.annotation.Autowired;


import org.example.repositories.UserRepository;
import org.example.models.User;

@RestController
@RequestMapping("/myAccount")
public class AccountController implements HandlerInterceptor {
    private final UserRepository userRepository;
    private final AuthenticationService authenticationService;

    @Autowired
    public AccountController(UserRepository userRepository, AuthenticationService authenticationService) {
        this.userRepository = userRepository;
        this.authenticationService = authenticationService;
    }

    @PostMapping("/getInfo")
    public ResponseEntity<?> getInfo(HttpServletRequest request) {
        String cookieValue = (String) request.getAttribute("cookieValue");
        Optional<User> user = userRepository.findByCookie(cookieValue);
        return ResponseEntity.ok(user.orElse(null));
    }

    @DeleteMapping("/deleteAccount")
    public ResponseEntity<?> deleteAccount(HttpServletRequest request) {
        String cookieValue = (String) request.getAttribute("cookieValue");
        Optional<User> user = userRepository.findByCookie(cookieValue);
        user.ifPresent(userRepository::delete);
        return ResponseEntity.ok("Account successfully deleted");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> LogOut(HttpServletRequest request) {
        String cookieValue = (String) request.getAttribute("cookieValue");
        Optional<User> users = userRepository.findByCookie(cookieValue);

        if(users.isPresent()){
            User user = users.get();
            user.setCookie(null);
            userRepository.save(user);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid cookies");
        }
        return ResponseEntity.ok().body("Logout success");
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if(authenticationService.checkAuthentication(request)){
            request.setAttribute("cookieValue", authenticationService.getCookieValue());
            return true;
        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid cookies");
            return false;
        }
    }
}