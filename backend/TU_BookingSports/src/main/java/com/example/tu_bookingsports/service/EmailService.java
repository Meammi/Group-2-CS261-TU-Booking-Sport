//backend\TU_BookingSports\src\main\java\com\example\tu_bookingsports\service\EmailService.java
package com.example.tu_bookingsports.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {
    private final JavaMailSender mailSender;
    private static final String BASE_URL = "http://localhost:8081/auth";
    private static final DateTimeFormatter REMINDER_TIME_FORMATTER =
            DateTimeFormatter.ofPattern("EEEE, MMM d yyyy HH:mm");

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

    public void sendReservationReminderEmail(String to, String displayName, String roomName, LocalDateTime startTime) {
        String recipientName = (displayName != null && !displayName.isBlank()) ? displayName : "there";
        String formattedStart = startTime.format(REMINDER_TIME_FORMATTER);
        String subject = "Your upcoming reservation is starting soon";
        StringBuilder body = new StringBuilder()
                .append("Hi ").append(recipientName).append(",\n\n")
                .append("This is a reminder that your reservation");

        if (roomName != null && !roomName.isBlank()) {
            body.append(" for ").append(roomName);
        }

        body.append(" is scheduled to start at ").append(formattedStart).append(".\n")
                .append("Please make sure to arrive on time.\n\n")
                .append("Thank you,\nTU Booking Sports");

        sendEmail(to, subject, body.toString());
    }

    private void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }
}
