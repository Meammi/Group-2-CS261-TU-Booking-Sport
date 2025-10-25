package com.example.tu_bookingsports.service;

import com.example.tu_bookingsports.DTO.FavoriteRequest;
import com.example.tu_bookingsports.DTO.MyFavoriteResponse;
import com.example.tu_bookingsports.model.*;
import com.example.tu_bookingsports.repository.FavoriteRepository;
import com.example.tu_bookingsports.repository.RoomRepository;
import com.example.tu_bookingsports.repository.SlotRepository;
import com.example.tu_bookingsports.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MyFavoriteService {

    private final FavoriteRepository favRepository;
    private final SlotRepository slotRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    private final int DURATION = 1;

    public MyFavoriteService(FavoriteRepository favRepository, SlotRepository slotRepository, RoomRepository roomRepository,UserRepository userRepository) {
        this.favRepository = favRepository;
        this.slotRepository = slotRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
    }

    public List<MyFavoriteResponse> getCurrentFavorite(UUID userId) {
        List<Favorite> myFav = favRepository.findByUserId(userId);
        LocalDateTime now = LocalDateTime.now();

        System.out.println(myFav);
        return myFav.stream()
                .map(b -> {
                    System.out.println("mapping for real "+b.getSlotId()+b.getRoomId());
                    Slot slot = slotRepository.findById(b.getSlotId()).orElse(null);
                    Rooms room = roomRepository.findById(b.getRoomId()).orElse(null);
                    if (slot == null || room == null) return null;

                    return new MyFavoriteResponse(
                            b.getFavoriteId(),
                            b.getUserId(),
                            b.getRoomId(),
                            b.getSlotId(),
                            room.getName(),
                            room.getLoc_name(),
                            slot.getSlotTime(),
                            slot.getSlotTime().plusHours(DURATION)
                    );
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    @Transactional
    public boolean deleteFavorite(UUID favoriteId) {
        Optional<Favorite> optionalReservation = favRepository.findById(favoriteId);

        if (optionalReservation.isPresent()) {
            Favorite fav = optionalReservation.get();

            favRepository.delete(fav);
            return true;
        }
        return false;
    }

    public Favorite createFavorite(FavoriteRequest req) {
        UUID userId = req.getUserId();
        UUID slotId = req.getSlotId();
        UUID roomId = req.getRoomId();

        User user = userRepository.findById(userId).orElse(null);
        Slot slot = slotRepository.findById(slotId).orElse(null);
        Rooms room = roomRepository.findById(roomId).orElse(null);
        if (user == null) {
            return null;
        }
        if (slot == null) {
            return null;
        }
        if (room == null) {
            return null;
        }

        Optional<Favorite> favoriteOptional = Optional.ofNullable(favRepository.findByUserIdAndSlotIdAndRoomId(userId, slotId, roomId));
        if (favoriteOptional.isPresent()) {
            return favRepository.findByUserIdAndSlotIdAndRoomId(userId, slotId, roomId);
        }

        // Create favorite
        Favorite newFavorite = new Favorite();
        newFavorite.setUserId(userId);
        newFavorite.setRoomId(roomId);
        newFavorite.setSlotId(slotId);

        return favRepository.save(newFavorite);
    }
}
