package org.example.service;

import lombok.Getter;
import org.example.models.user.*;
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
    private String token;

    @Autowired
    public AuthenticationService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Boolean checkAuthentication(HttpServletRequest request) {
        System.out.println("\033[30m AuthenticationService(status): start\033[0m");

        String token = request.getHeader("Authorization");
        
        System.out.println("\033[30m AuthenticationService(check token): " + token + "\033[0m");
        if (token == null || token.isEmpty()) {
            System.out.println("\033[30m AuthenticationService(status): fail\033[0m");
            return false;
        }
        System.out.println("\033[30m AuthenticationService(status): search user...\033[0m");
        Optional<User> user = userRepository.findByToken(token);
        if(user.isPresent()) System.out.println("\033[30m AuthenticationService(status): succses\033[0m");
        
        return user.isPresent();
    }
}
