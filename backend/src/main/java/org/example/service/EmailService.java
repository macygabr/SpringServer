package org.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.context.annotation.Scope;
import java.util.UUID;
import lombok.Data;

@Data
@Service
public class EmailService {

    private String firstName;
    private String lastName;
    private String email;
    private String password;

    private String token;

    @Autowired
    private JavaMailSender mailSender;

    public void sendConfirmationEmail() {
        token = generateToken();
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject(getSubject());
        message.setText(getBody());
        message.setFrom(getFromEmail());
        mailSender.send(message);
    }

    public void setFirstName(String str){
        check(str);
        firstName = str;
    }
    public void setLastName(String str){
        check(str);
        lastName = str;
    }
    public void setEmail(String str){
        check(str);
        email = str;
    }
    public void setPassword(String str){
        check(str);
        password = str;
    }

    private void check(String str) {
        if (str == null || str.isEmpty() || str.length() > 100) {
            throw new IllegalArgumentException("All fields are required");
        }

        if (!str.matches("^[\\p{L}\\p{N}_+&*-@.]+$")) {
            throw new IllegalArgumentException("Invalid fields");
        }
    }

    private String generateToken() {
        return UUID.randomUUID().toString();
    }

    private String getFromEmail() {
        return "tursumatovnur@gmail.com";
    }

    private String getSubject() {
        return "Confirm your email";
    }

    private String getBody() {
        String confirmationUrl = "http://37.194.168.90:3000/auth/confirm?token=" + token;
        return "Hello " + firstName + " " + lastName + ",\n\n" +
                "Please confirm your email by clicking on the link below:\n\n" +
                confirmationUrl + "\n\n" +
                "Thank you!";
    }
}
