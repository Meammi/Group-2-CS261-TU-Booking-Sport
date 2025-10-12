package com.example.tu_bookingsports.service;

import com.example.tu_bookingsports.DTO.HomepageResponse;
import com.example.tu_bookingsports.model.Rooms;
import com.example.tu_bookingsports.repository.HomepageRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HomepageService {

    private final HomepageRepository homepageRepository;

    public HomepageService(HomepageRepository homepageRepository) {
        this.homepageRepository = homepageRepository;
    }

    public List<HomepageResponse> getHomepageData() {
        List<Rooms> rooms = homepageRepository.findAll();

        return rooms.stream()
                    .collect(Collectors.toMap(
                            r -> r.getType() + "_" + r.getLoc_name(),
                            r -> new HomepageResponse(r.getType(), r.getLoc_name()),
                            (existing, replacement) -> existing // ถ้ามีซ้ำ ให้ใช้ตัวแรก
                    ))
                    .values()
                    .stream()
                    .collect(Collectors.toList());
    }

}
