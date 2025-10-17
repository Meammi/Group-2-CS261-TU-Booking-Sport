//backend\TU_BookingSports\src\main\java\com\example\tu_bookingsports\service\EmailService.java
package com.example.tu_bookingsports.service;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender mailSender;
    private static final String BASE_URL = "http://localhost:8081/auth";

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(String to, String token) {
        String link = BASE_URL + "/verify?token=" + token;
        sendEmail(to, "Verify your TU Booking Sports account",
                "Click this link to verify your account:\n" + link);
    }

    public void sendPasswordResetEmail(String to, String token) {
        String link = BASE_URL + "/reset-password?token=" + token;
        sendEmail(to, "Reset your TU Booking Sports password",
                "Click this link to reset your password:\n" + link);
    }

    private void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }
}
