//C:\Users\print\OneDrive\Desktop\MyWork\CS261\Group-2-CS261-TU-Booking-Sport\backend\src\main\java\com\example\tu_bookingsports\controller\HomepageController.java
package com.example.tu_bookingsports.controller;

import com.example.tu_bookingsports.DTO.HomepageResponse;
import com.example.tu_bookingsports.service.HomepageService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
public class HomepageController {

    private final HomepageService homepageService;

    public HomepageController(HomepageService homepageService) {
        this.homepageService = homepageService;
    }

    @GetMapping("/")
    public List<HomepageResponse> getHomepage() {
        return homepageService.getHomepageData();
    }
}