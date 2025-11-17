package com.example.tu_bookingsports.controller;

import com.example.tu_bookingsports.DTO.GeolocationResponse;
import com.example.tu_bookingsports.service.RoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/location")
public class LocationController{

    private final RoomService roomService;
    public LocationController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping("/{locationName}")
    public ResponseEntity<GeolocationResponse> getCoordinates(@PathVariable String locationName){
        GeolocationResponse response = roomService.getLocationByName(locationName);

        return ResponseEntity.ok(response);
    }
}