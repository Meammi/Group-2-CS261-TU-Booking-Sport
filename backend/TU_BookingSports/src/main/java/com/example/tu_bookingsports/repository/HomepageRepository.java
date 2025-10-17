//C:\Users\print\OneDrive\Desktop\MyWork\CS261\Group-2-CS261-TU-Booking-Sport\backend\src\main\java\com\example\tu_bookingsports\repository\HomepageRepository.java
package com.example.tu_bookingsports.repository;

import com.example.tu_bookingsports.model.Rooms;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface HomepageRepository extends JpaRepository<Rooms, UUID> {
}