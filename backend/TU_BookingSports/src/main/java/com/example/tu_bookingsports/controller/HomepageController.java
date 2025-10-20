package com.example.tu_bookingsports.controller;

import com.example.tu_bookingsports.DTO.HomepageResponse;
import com.example.tu_bookingsports.service.HomepageService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/homepage")
public class HomepageController {

    private final HomepageService homepageService;

    public HomepageController(HomepageService homepageService) {
        this.homepageService = homepageService;
    }

    @GetMapping
    public List<HomepageResponse> getHomepage() {
        return homepageService.getHomepageData();
    }
}