package org.example.service;

import lombok.Getter;
import org.example.models.User;
import org.example.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.Cookie;

import java.util.Optional;

@Getter
@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private String cookie;

    @Autowired
    public AuthenticationService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Boolean checkAuthentication(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            System.out.println("\033[31m All cookies \033[0m");
            for (Cookie cookieTest : cookies) {
                System.out.println("\033[31m" + cookieTest + "\033[0m");
                if (cookieTest.getName().equals("custom-auth-token")) {
                    cookie = cookieTest.getValue();
                }
            }
        }

        if (cookie == null) {
            return false;
        }

        Optional<User> user = userRepository.findByCookie(cookie);
        
        return user.isPresent();
    }
}
