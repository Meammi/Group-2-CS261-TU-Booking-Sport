package com.example.tu_bookingsports.controller;

import com.example.tu_bookingsports.DTO.MyBookingResponse;
import com.example.tu_bookingsports.service.MyBookingService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/MyBookings")
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


}
