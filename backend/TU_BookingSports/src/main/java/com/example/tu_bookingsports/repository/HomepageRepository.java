package com.example.tu_bookingsports.repository;

import com.example.tu_bookingsports.model.Rooms;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface HomepageRepository extends JpaRepository<Rooms, UUID> {
}