package com.example.tu_bookingsports.repository;

import com.example.tu_bookingsports.model.Favorite;
import com.example.tu_bookingsports.model.Reservations;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, UUID> {

    List<Favorite> findByUserId(UUID userId);

    Favorite findByUserIdAndSlotIdAndRoomId(UUID userId, UUID slotId, UUID roomId);

}
