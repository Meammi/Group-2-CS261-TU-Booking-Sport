//src\main\java\com\example\tu_bookingsports\service\EmailService.java
package com.example.tu_bookingsports.service;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(String to, String token) {
        String link = "http://localhost:8081/auth/verify?token=" + token;
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Verify your TU Booking Sports account");
        message.setText("Click this link to verify: " + link);
        mailSender.send(message);
    }
}
