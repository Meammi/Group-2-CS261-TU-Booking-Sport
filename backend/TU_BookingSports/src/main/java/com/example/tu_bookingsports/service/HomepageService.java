//C:\Users\print\OneDrive\Desktop\MyWork\CS261\Group-2-CS261-TU-Booking-Sport\backend\src\main\java\com\example\tu_bookingsports\service\HomepageService.java
package com.example.tu_bookingsports.service;

import com.example.tu_bookingsports.DTO.HomepageResponse;
import com.example.tu_bookingsports.model.Rooms;
import com.example.tu_bookingsports.repository.HomepageRepository;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class HomepageService {

    private final HomepageRepository homepageRepository;

    public HomepageService(HomepageRepository homepageRepository) {
        this.homepageRepository = homepageRepository;
    }

    public List<HomepageResponse> getHomepageData() {
        List<Rooms> rooms = homepageRepository.findAll();

        Map<String, Map<String, Long>> grouped = rooms.stream()
                .collect(Collectors.groupingBy(
                        Rooms::getType,                  // group by type
                        Collectors.groupingBy(
                                Rooms::getLoc_name,      // group by loc_name
                                Collectors.counting()    // count room
                        )
                ));

        List<HomepageResponse> responseList = new ArrayList<>();
        grouped.forEach((type, locMap) -> {
            locMap.forEach((locName, count) -> {
                responseList.add(new HomepageResponse(type, locName, count));
            });
        });
        return responseList;
    }

}
