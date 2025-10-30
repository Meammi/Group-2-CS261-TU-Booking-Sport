package com.example.tu_bookingsports.service;

import com.example.tu_bookingsports.model.Reservations;
import com.example.tu_bookingsports.model.Rooms;
import com.example.tu_bookingsports.model.User;
import com.example.tu_bookingsports.repository.ReservationRepository;
import com.example.tu_bookingsports.repository.RoomRepository;
import com.example.tu_bookingsports.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.EnumSet;
import java.util.List;
import java.util.Optional;

@Service
public class ReservationReminderService {
    private static final Logger log = LoggerFactory.getLogger(ReservationReminderService.class);

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final EmailService emailService;
    private final long reminderLeadMinutes;
    private final long reminderWindowMinutes;

    public ReservationReminderService(
            ReservationRepository reservationRepository,
            UserRepository userRepository,
            RoomRepository roomRepository,
            EmailService emailService,
            @Value("${reservation.reminder.lead-minutes:15}") long reminderLeadMinutes,
            @Value("${reservation.reminder.window-minutes:1}") long reminderWindowMinutes
    ) {
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
        this.emailService = emailService;
        this.reminderLeadMinutes = reminderLeadMinutes;
        this.reminderWindowMinutes = Math.max(1, reminderWindowMinutes);
    }

    @Scheduled(fixedDelayString = "${reservation.reminder.check-interval-ms:60000}")
    @Transactional
    public void sendUpcomingReservationReminders() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime windowStart = now.plusMinutes(reminderLeadMinutes);
        LocalDateTime windowEnd = windowStart.plusMinutes(reminderWindowMinutes);

        List<Reservations> upcoming = reservationRepository.findByStartTimeBetweenAndStatusInAndReminderSentFalse(
                windowStart,
                windowEnd,
                EnumSet.of(Reservations.ReservationStatus.CONFIRMED)
        );

        if (upcoming.isEmpty()) {
            return;
        }

        for (Reservations reservation : upcoming) {
            sendReminder(reservation);
        }
    }

    private void sendReminder(Reservations reservation) {
        Optional<User> userOpt = userRepository.findById(reservation.getUser());
        if (userOpt.isEmpty()) {
            log.warn("Skipping reminder for reservation {}: user {} not found",
                    reservation.getReservationID(), reservation.getUser());
            reservation.setReminderSent(true);
            reservationRepository.save(reservation);
            return;
        }

        User user = userOpt.get();
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            log.warn("Skipping reminder for reservation {}: user {} has no e-mail",
                    reservation.getReservationID(), reservation.getUser());
            reservation.setReminderSent(true);
            reservationRepository.save(reservation);
            return;
        }

        String roomName = roomRepository.findById(reservation.getRoom())
                .map(Rooms::getName)
                .orElse(null);

        try {
            emailService.sendReservationReminderEmail(
                    user.getEmail(),
                    user.getDisplayNameEn(),
                    roomName,
                    reservation.getStartTime()
            );
            reservation.setReminderSent(true);
            reservationRepository.save(reservation);
            log.info("Sent reminder e-mail for reservation {} to {}", reservation.getReservationID(), user.getEmail());
        } catch (Exception ex) {
            log.error("Failed to send reminder for reservation {} to {}",
                    reservation.getReservationID(), user.getEmail(), ex);
        }
    }
}
