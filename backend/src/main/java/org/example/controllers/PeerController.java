package org.example.controllers;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import org.example.service.EmailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.Cookie;

import org.example.repositories.PeerRepository;
import org.example.models.Peer;

import java.util.UUID;

@RestController
public class PeerController {
    private final PeerRepository peerRepository;

    @Autowired
    public PeerController(PeerRepository peerRepository) {
        this.peerRepository = peerRepository;
    }

    @PostMapping("/peer")
    public ResponseEntity<?> SignUp(@RequestBody PeerRequest peerRequest) {
        
        if(peerRepository.findByNickName(peerRequest.getNickName()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User already exists");
        }
        
        System.out.println("\033[34m"+peerRequest+ "\033[0m");

        Peer p = new Peer();
        p.setNickName(peerRequest.getNickName());
        peerRepository.save(p);

        return ResponseEntity.ok().body("Success");
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PeerRequest {
        private String nickName;
    }
}