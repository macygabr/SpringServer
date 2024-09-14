package org.example.controllers;

import java.util.Optional;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.Cookie;

import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.beans.factory.annotation.Autowired;


import org.example.repositories.UserRepository;
import org.example.models.User;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.Enumeration;

@RestController
@RequestMapping("/myAccount")
public class AccountController implements HandlerInterceptor {
    private final UserRepository userRepository;
    
    @Autowired
    public AccountController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/getInfo")
    public ResponseEntity<?> MyAccount(HttpServletRequest request) {
        String cookieValue = (String) request.getAttribute("cookieValue");
        Optional<User> user = userRepository.findByCookie(cookieValue);
        return ResponseEntity.ok(user.get());
    }

    @DeleteMapping("/deleteAccount")
    public ResponseEntity<?> deleteAccount(HttpServletRequest request) {
        String cookieValue = (String) request.getAttribute("cookieValue");
        Optional<User> user = userRepository.findByCookie(cookieValue);
        userRepository.delete(user.get());
        return ResponseEntity.ok("Account successfully deleted");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> LogOut(HttpServletRequest request) {
        String cookieValue = (String) request.getAttribute("cookieValue");
        Optional<User> users = userRepository.findByCookie(cookieValue);
        
        User user = users.get();
        user.setCookie(null);
        userRepository.save(user);
        return ResponseEntity.ok().body("Logout success");
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        Cookie[] cookies = request.getCookies();
        String cookieValue = null;

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("macygabr")) {
                    cookieValue = cookie.getValue();
                }
            }
        }
        if (cookieValue == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid cookies");
            return false;
        }

        Optional<User> user = userRepository.findByCookie(cookieValue);
        if (user.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid cookies");
            return false;
        }
        request.setAttribute("cookieValue", cookieValue);
        return true;
    }
}