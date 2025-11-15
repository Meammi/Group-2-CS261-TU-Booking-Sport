package com.example.tu_bookingsports.controller;

import com.example.tu_bookingsports.DTO.MyBookingResponse;
import com.example.tu_bookingsports.service.MyBookingService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;


import java.util.List;
import java.util.UUID;
import java.util.Map;
import java.util.HashMap;


@RestController
@RequestMapping("/MyBookings")
@CrossOrigin(origins = "http://localhost:3000")

public class MyBookingController {

    private final MyBookingService myBookingService;

    public MyBookingController(MyBookingService myBookingService) {
        this.myBookingService = myBookingService;
    }

    @GetMapping("/{userId}")
    public Map<String, List<MyBookingResponse>> getAllBookings(@PathVariable UUID userId) {
        List<MyBookingResponse> currentBookings = myBookingService.getCurrentBookings(userId);
        List<MyBookingResponse> historyBookings = myBookingService.getHistoryBookings(userId);

        // สร้าง Map เพื่อแยก current / history
        Map<String, List<MyBookingResponse>> response = new HashMap<>();
        response.put("current", currentBookings);
        response.put("history", historyBookings);

        return response;
    }

    @PatchMapping("/cancel/{reservationId}")
    public String cancelBooking(@PathVariable UUID reservationId) {
        boolean cancelled = myBookingService.cancelBooking(reservationId);
        if (cancelled) {
            return "{\"Reservation cancelled successfully.\"}";
        } else {
            return "{\"Reservation not found or already cancelled.\"}";
        }
    }
}