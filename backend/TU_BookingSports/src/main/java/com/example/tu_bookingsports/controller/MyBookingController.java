package com.example.tu_bookingsports.controller;

import com.example.tu_bookingsports.DTO.MyBookingResponse;
import com.example.tu_bookingsports.service.MyBookingService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/MyBookings")
public class MyBookingController {

    private final MyBookingService myBookingService;

    public MyBookingController(MyBookingService myBookingService) {
        this.myBookingService = myBookingService;
    }

    @GetMapping("/current/{userId}")
    public List<MyBookingResponse> getCurrentBookings(@PathVariable UUID userId) {
        return myBookingService.getCurrentBookings(userId);
    }

    @GetMapping("/history/{userId}")
    public List<MyBookingResponse> getHistoryBookings(@PathVariable UUID userId) {
        return myBookingService.getHistoryBookings(userId);
    }
}
