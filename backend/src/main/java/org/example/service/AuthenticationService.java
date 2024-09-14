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
    private String cookieValue;

    @Autowired
    public AuthenticationService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Boolean checkAuthentication(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("macygabr")) {
                    cookieValue = cookie.getValue();
                }
            }
        }

        if (cookieValue == null) {
            return false;
        }

        Optional<User> user = userRepository.findByCookie(cookieValue);
        return user.isPresent();
    }
}
