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

import org.example.repositories.UserRepository;
import org.example.service.S3Service;
import org.example.models.User;

@RestController
@RequestMapping("/account")
public class AccountController implements HandlerInterceptor {
    private final UserRepository userRepository;
    private final AuthenticationService authenticationService;
    private final S3Service s3Service;

    @Autowired
    public AccountController(UserRepository userRepository, AuthenticationService authenticationService, S3Service s3Service) {
        this.userRepository = userRepository;
        this.authenticationService = authenticationService;
        this.s3Service = s3Service;
    }

    @GetMapping("/getinfo")
    public ResponseEntity<?> getInfo(HttpServletRequest request) {
        String cookie = (String) request.getAttribute("cookie");
        System.out.println("\033[32m getInfo(cookie): " + cookie + "\033[0m");
        Optional<User> user = userRepository.findByCookie(cookie);
        System.out.println("\033[32m getInfo(user): " + user.get() + "\033[0m");
        return ResponseEntity.ok(user.orElse(null));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteAccount(HttpServletRequest request) {
        String cookie = (String) request.getAttribute("cookie");
        Optional<User> user = userRepository.findByCookie(cookie);
        user.ifPresent(userRepository::delete);
        return ResponseEntity.ok("Account successfully deleted");
    }

    @GetMapping("/logout")
    public ResponseEntity<?> LogOut(HttpServletRequest request) {
        String cookie = (String) request.getAttribute("cookie");
        System.out.println("\033[32m logout(cookie): " + cookie + "\033[0m");
        Optional<User> users = userRepository.findByCookie(cookie);
        if(users.isPresent()){
            User user = users.get();
            user.setCookie(null);
            userRepository.save(user);
            System.out.println("\033[35m logout(status): succses\033[0m");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid cookies");
        }
        return ResponseEntity.ok().body("Logout success");
    }

    @PutMapping("/update")
    public ResponseEntity<?> Update(HttpServletRequest request, @RequestBody User updatedUser) {
        Optional<User> users = userRepository.findByCookie((String) request.getAttribute("cookie"));
        User user = users.get();
        user.update(updatedUser);
        userRepository.save(user);
        return ResponseEntity.ok().body("Update success");
    }

    @PostMapping("/savefile")
    public ResponseEntity<?> saveFile(HttpServletRequest request, @RequestParam("file") MultipartFile file) {
        Optional<User> users = userRepository.findByCookie((String) request.getAttribute("cookie"));

        System.out.println("\033[36m savefile(name): " + file.getOriginalFilename() + "\033[0m");
        String url = s3Service.uploadFile(file);
        System.out.println("\033[36m savefile(url): " + url + "\033[0m");

        users.ifPresent(user -> user.setAvatar(url));
        users.ifPresent(userRepository::save);

        ResponseEntity<?> response = ResponseEntity.ok(url);
        System.out.println("\033[36m savefile(response): " + response + "\033[0m");
        return response;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if(authenticationService.checkAuthentication(request)){
            System.out.println("\033[31m " + authenticationService.getCookie() + "\033[0m");
            request.setAttribute("cookie", authenticationService.getCookie());
            return true;
        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid cookies");
            return false;
        }
    }
}