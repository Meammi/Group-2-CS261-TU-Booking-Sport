package com.example.tu_bookingsports.controller;

//import com.example.tu_bookingsports.service.ReservationService2;
import com.google.zxing.WriterException;
import org.springframework.web.bind.annotation.*;

import com.example.tu_bookingsports.service.ReservationService;
import com.example.tu_bookingsports.service.RoomService;
import com.example.tu_bookingsports.DTO.RoomReservationDTO;
import com.example.tu_bookingsports.DTO.ReservationRequest;
import com.example.tu_bookingsports.model.Reservations;
import com.example.tu_bookingsports.model.Reservations.ReservationStatus;
import com.example.tu_bookingsports.service.AuthService;
import com.example.tu_bookingsports.model.User;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.UUID;
import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/reservation")
//@CrossOrigin(origins = "http://localhost:3000") //ยิงจากท่ไหนก็ได้
public class ReservationController {
    private final ReservationService reservationService;
    private final AuthService authService;

    public ReservationController(ReservationService reservationService, AuthService authService) {
        this.reservationService = reservationService;
        this.authService = authService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createReservation(@RequestBody ReservationRequest request,
                                               @CookieValue(value = "access_token", required = false) String token //ดึง token จาก cookie
    ){

        if (token == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing access_token cookie");
        }

        System.out.println("getUserId "+request.getUserId());
        System.out.println("getSlotId "+request.getSlotId());

        User user = authService.getCurrentUser(token);
        UUID loggedInUserId = user.getUserId();
        System.out.println("getUserId from token"+loggedInUserId);

        if (request.getUserId() != null && request.getSlotId() != null) {
            try {
                System.out.println("reservation controller is creating reservation");
                Reservations newReservation = reservationService.createReservation(request,loggedInUserId);
                return ResponseEntity.status(HttpStatus.CREATED).body(newReservation);
            } catch (RuntimeException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
            }
        }

        return ResponseEntity.ok("Invalid Arguments: Please send UserId, SlotId");
    }

}