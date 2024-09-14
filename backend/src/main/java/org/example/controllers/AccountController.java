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
        Cookie[] cookies = request.getCookies();
        String cookieValue = null;
        if (cookies != null) {
        for (Cookie cookie : cookies) {
                if (cookie.getName().equals("macygabr")) cookieValue = cookie.getValue();
            }
        }

        Optional<User> user = userRepository.findByCookie(cookieValue);

        if (cookieValue == null || user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid cookies");
        }

        return ResponseEntity.ok(user.get());
    }

    @DeleteMapping("/deleteAccount")
    public ResponseEntity<?> deleteAccount(HttpServletRequest request) {
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
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid cookies");
        }

        Optional<User> user = userRepository.findByCookie(cookieValue);

        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid cookies");
        }

        userRepository.delete(user.get());

        return ResponseEntity.ok("Account successfully deleted");
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

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        Cookie[] cookies = request.getCookies();
        String cookieValue = null;
        System.out.println("\033[32m" + "Test!!!" + "\033[0m");
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
            response.getWriter().write("Invalid user");
            return false;
        }

        return true;
    }
}