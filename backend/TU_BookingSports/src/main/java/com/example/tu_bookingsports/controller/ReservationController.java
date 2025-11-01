package com.example.tu_bookingsports.controller;
import com.example.tu_bookingsports.service.ReservationService;
//import com.example.tu_bookingsports.service.ReservationService2;
import com.google.zxing.WriterException;
import org.springframework.web.bind.annotation.*;
import com.example.tu_bookingsports.service.RoomService;
import com.example.tu_bookingsports.DTO.RoomReservationDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import com.example.tu_bookingsports.model.Reservations.ReservationStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
//import com.example.tu_bookingsports.service.ReservationService;
//import com.example.tu_bookingsports.DTO.ConfirmationRequest;
import com.example.tu_bookingsports.DTO.ReservationRequest;
import com.example.tu_bookingsports.model.Reservations;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/reservation")
@CrossOrigin(origins = "") //ยิงจากท่ไหนก็ได้
public class ReservationController {
    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createReservation(@RequestBody ReservationRequest request) {

        System.out.println("getUserId "+request.getUserId());
        System.out.println("getSlotId "+request.getSlotId());

        if (request.getUserId() != null && request.getSlotId() != null) {
            try {
                System.out.println("reservation controller is creating reservation");
                Reservations newReservation = reservationService.createReservation(request);
                Map<String, Object> body = new HashMap<>();
                body.put("message", "Reservation created successfully");
                body.put("reservation", newReservation);

                return ResponseEntity.status(HttpStatus.CREATED).body(body);
            } catch (RuntimeException e) {
                Map<String, Object> errorBody = new HashMap<>();
                errorBody.put("message", e.getMessage());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorBody);
            }
        }

        Map<String, Object> invalidBody = new HashMap<>();
        invalidBody.put("message", "Invalid Arguments: Please send UserId, SlotId");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(invalidBody);
    }

}
