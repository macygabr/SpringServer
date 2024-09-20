package org.example.controllers;

import java.util.Optional;

import jakarta.servlet.http.HttpServletResponse;
import org.example.service.AuthenticationService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.example.repositories.UserRepository;
import org.example.service.S3Service;
import org.example.models.user.*;

@RestController
@RequestMapping("/account")
public class AccountController implements HandlerInterceptor {
    private final UserRepository userRepository;
    private final AuthenticationService authenticationService;
    private final S3Service s3Service;

    @Autowired
    public AccountController(UserRepository userRepository, S3Service s3Service) {
        this.userRepository = userRepository;
        this.authenticationService = new AuthenticationService(userRepository);
        this.s3Service = s3Service;
    }

    @GetMapping("/getinfo")
    public ResponseEntity<?> getInfo(HttpServletRequest request) {
        System.out.println("\033[33m getInfo(status): start\033[0m");
        String token = request.getHeader("Authorization");
        Optional<User> user = userRepository.findByToken(token);
        System.out.println("\033[32m getInfo(user): " + user.get() + "\033[0m");
        return ResponseEntity.ok(user.orElse(null));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteAccount(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        Optional<User> user = userRepository.findByToken(token);
        user.ifPresent(userRepository::delete);
        return ResponseEntity.ok("Account successfully deleted");
    }

    @GetMapping("/logout")
    public ResponseEntity<?> LogOut(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        System.out.println("\033[33m logout by token: " + token + "  ....\033[0m");
        Optional<User> users = userRepository.findByToken(token);
        if(users.isPresent()){
            User user = users.get();
            user.setToken("");
            userRepository.save(user);
            System.out.println("\033[32m logout(status): succses\033[0m");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid tokens");
        }
        return ResponseEntity.ok().body("Logout success");
    }

    @PutMapping("/update")
    public ResponseEntity<?> Update(HttpServletRequest request, @RequestBody User updatedUser) {
        Optional<User> users = userRepository.findByToken((String) request.getHeader("Authorization"));
        User user = users.get();
        // user.update(updatedUser);
        userRepository.save(user);
        return ResponseEntity.ok().body("Update success");
    }

    @PostMapping("/savefile")
    public ResponseEntity<?> saveFile(HttpServletRequest request, @RequestParam("file") MultipartFile file) {
        System.out.println("\033[33m savefile(status): start\033[0m");
        Optional<User> users = userRepository.findByToken((String) request.getHeader("Authorization"));
        System.out.println("\033[33m savefile(name): " + file.getOriginalFilename() + "\033[0m");
        String url = s3Service.uploadFile(file);
        System.out.println("\033[32m savefile(status): succses" + url + "\033[0m");

        users.ifPresent(user -> user.setAvatar(url));
        users.ifPresent(userRepository::save);

        ResponseEntity<?> response = ResponseEntity.ok(url);
        System.out.println("\033[34m savefile(response): " + response + "\033[0m");
        return response;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        System.out.println("\033[33m preHandle(status): start\033[0m");
        if(authenticationService.checkAuthentication(request)){
            System.out.println("\033[32m preHandle(status): succses\033[0m");
            return true;
        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid tokens");
            System.out.println("\033[31m preHandle(status): fail\033[0m");
            return false;
        }
    }
}