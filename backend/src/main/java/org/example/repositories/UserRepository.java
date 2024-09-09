package org.example.repositories;

import java.util.Optional;

import org.example.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByCookie(String cookie);
}