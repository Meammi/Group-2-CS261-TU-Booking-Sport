package com.example.tu_bookingsports.controller;

import com.example.tu_bookingsports.model.Reservations;
import com.example.tu_bookingsports.model.Rooms;
import com.example.tu_bookingsports.model.Slot;
import com.example.tu_bookingsports.model.User;
import com.example.tu_bookingsports.repository.ReservationRepository;
import com.example.tu_bookingsports.repository.RoomRepository;
import com.example.tu_bookingsports.repository.SlotRepository;
import com.example.tu_bookingsports.repository.UserRepository;
import com.example.tu_bookingsports.service.ReservationReminderService;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/dev")
@ConditionalOnProperty(prefix = "dev.tools", name = "enabled", havingValue = "true", matchIfMissing = false)
public class DevToolsController {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final SlotRepository slotRepository;
    private final ReservationReminderService reminderService;

    public DevToolsController(ReservationRepository reservationRepository,
                              UserRepository userRepository,
                              RoomRepository roomRepository,
                              SlotRepository slotRepository,
                              ReservationReminderService reminderService) {
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
        this.slotRepository = slotRepository;
        this.reminderService = reminderService;
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleDevException(Exception ex) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("error", ex.getClass().getSimpleName());
        body.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }

    public static class SeedRequest {
        public String email;           // preferred to resolve user
        public UUID userId;            // optional
        public UUID roomId;            // optional
        public Integer minutesFromNow; // optional, default 2
    }

    @PostMapping("/seedReminder")
    public ResponseEntity<?> seedReminder(@RequestBody SeedRequest req) {
        int minutes = (req.minutesFromNow == null || req.minutesFromNow < 0) ? 2 : req.minutesFromNow;

        // Resolve user
        Optional<User> userOpt = Optional.empty();
        if (req.userId != null) {
            userOpt = userRepository.findById(req.userId);
        } else if (req.email != null && !req.email.isBlank()) {
            userOpt = userRepository.findByEmail(req.email);
        } else {
            List<User> allUsers = userRepository.findAll();
            if (!allUsers.isEmpty()) userOpt = Optional.of(allUsers.get(0));
        }
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "User not found. Provide email or userId referencing an existing user"));
        }
        User user = userOpt.get();

        // Resolve room
        Optional<Rooms> roomOpt = Optional.empty();
        if (req.roomId != null) {
            roomOpt = roomRepository.findById(req.roomId);
        } else {
            List<Rooms> rooms = roomRepository.findAll();
            if (!rooms.isEmpty()) roomOpt = Optional.of(rooms.get(0));
        }
        if (roomOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "No rooms available to seed a reservation"));
        }
        Rooms room = roomOpt.get();

        // Resolve any slot (only to satisfy NOT NULL); we don't rely on its time for reminders
        UUID slotId;
        List<Slot> slotsForRoom = slotRepository.findSlotsByRoomId(room.getRoom_id());
        if (!slotsForRoom.isEmpty()) {
            slotId = slotsForRoom.get(0).getSlotId();
        } else {
            // Fallback to any slot in DB
            List<Slot> anySlots = slotRepository.findAll();
            if (anySlots.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "No slots found in database to attach to test reservation"));
            }
            slotId = anySlots.get(0).getSlotId();
        }

        LocalDateTime start = LocalDateTime.now().plusMinutes(minutes);
        LocalDateTime end = start.plusHours(1);

        Reservations r = new Reservations();
        r.setUser(user.getUserId());
        r.setRoom(room.getRoom_id());
        r.setSlotId(slotId);
        r.setStartTime(start);
        r.setEndTime(end);
        r.setStatus(Reservations.ReservationStatus.CONFIRMED);
        r.setPrice(room.getPrice() != null ? room.getPrice() : BigDecimal.ZERO);
        // reminderSent defaults to false in entity ctor

        r = reservationRepository.save(r);

        return ResponseEntity.ok(Map.of(
                "reservationId", r.getReservationID(),
                "userId", r.getUser(),
                "roomId", r.getRoom(),
                "slotId", r.getSlotId(),
                "startTime", r.getStartTime().toString(),
                "status", r.getStatus().toString()
        ));
    }

    @PostMapping("/reminders/run")
    public ResponseEntity<?> runReminderNow() {
        try {
            reminderService.sendUpcomingReservationReminders();
            return ResponseEntity.ok(Map.of("message", "Reminder job executed"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
