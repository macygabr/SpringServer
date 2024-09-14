package org.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
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
    private String subject;
    private String body;
    private String fromEmail = "tursumatovnur@gmail.com";

    @Autowired
    private JavaMailSender mailSender;

    public void sendConfirmationEmail() {
        SimpleMailMessage message = new SimpleMailMessage();
        token = UUID.randomUUID().toString();
        String confirmationUrl = "http://37.194.168.90:3000/authentication/confirm?token=" + token;
        subject = "Email Confirmation";
        body = "Hello, " + firstName + " " + lastName + " \n" + "Please click the following link to confirm your email: \n" + confirmationUrl;
        message.setTo(email);
        message.setSubject(subject);
        message.setText(body);
        message.setFrom(fromEmail);
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

        if(!str.matches("^[a-zA-Z0-9_+&*-]+$")) {
            throw new IllegalArgumentException("Invalid fields");
        }
    }
}
