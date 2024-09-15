package org.example.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

import static org.junit.jupiter.api.Assertions.assertThrows;

public class EmailServiceTest {
    private EmailService emailService;

    @BeforeEach
    public void init() throws Exception {
        emailService = new EmailService();
    }
    @Test
    public void testNull() throws Exception {
        assertThrows(IllegalArgumentException.class, () -> {
            emailService.setEmail(null);
        });

        assertThrows(IllegalArgumentException.class, () -> {
            emailService.setPassword(null);
        });

        assertThrows(IllegalArgumentException.class, () -> {
            emailService.setFirstName(null);
        });

        assertThrows(IllegalArgumentException.class, () -> {
            emailService.setLastName(null);
        });
    }

    @Test
    public void testEmpty() throws Exception {
        assertThrows(IllegalArgumentException.class, () -> {
            emailService.setEmail("");
        });

        assertThrows(IllegalArgumentException.class, () -> {
            emailService.setPassword("");
        });

        assertThrows(IllegalArgumentException.class, () -> {
            emailService.setFirstName("");
        });

        assertThrows(IllegalArgumentException.class, () -> {
            emailService.setLastName("");
        });
    }
    @Test
    public void testSpace() throws Exception {
        assertThrows(IllegalArgumentException.class, () -> {
            emailService.setEmail(" test@mail.ru");
        });

        assertThrows(IllegalArgumentException.class, () -> {
            emailService.setPassword("123 45");
        });

        assertThrows(IllegalArgumentException.class, () -> {
            emailService.setFirstName("test test");
        });

        assertThrows(IllegalArgumentException.class, () -> {
            emailService.setLastName("test test");
        });
    }

    @Test
    public void testCorrect() throws Exception {
        assertDoesNotThrow(() -> emailService.setEmail("example@gmail.com"));
        assertDoesNotThrow(() -> emailService.setPassword("elrgher"));
        assertDoesNotThrow(() -> emailService.setFirstName("цкпку"));
        assertDoesNotThrow(() -> emailService.setLastName("erger.,m3245"));
    }
}
