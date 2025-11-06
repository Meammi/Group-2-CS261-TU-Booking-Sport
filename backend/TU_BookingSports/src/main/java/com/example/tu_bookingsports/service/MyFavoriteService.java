package com.example.tu_bookingsports.service;

import com.example.tu_bookingsports.DTO.FavoriteRequest;
import com.example.tu_bookingsports.DTO.MyFavoriteResponse;
import com.example.tu_bookingsports.model.Favorite;
import com.example.tu_bookingsports.model.Rooms;
import com.example.tu_bookingsports.model.Slot;
import com.example.tu_bookingsports.repository.FavoriteRepository;
import com.example.tu_bookingsports.repository.RoomRepository;
import com.example.tu_bookingsports.repository.SlotRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalTime;
import java.util.*;

@Service
public class MyFavoriteService {

    private final FavoriteRepository favRepository;
    private final SlotRepository slotRepository;
    private final RoomRepository roomRepository;

    private final int DURATION = 1;

    public MyFavoriteService(FavoriteRepository favRepository, SlotRepository slotRepository, RoomRepository roomRepository) {
        this.favRepository = favRepository;
        this.slotRepository = slotRepository;
        this.roomRepository = roomRepository;
    }

    public MyFavoriteResponse createFavorite(FavoriteRequest req,UUID loggedInUserId) {
        UUID roomId = req.getRoomId();
        UUID slotId = req.getSlotId();

        if (!roomRepository.existsById(roomId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found with id: " + roomId);
        }

        if (!slotRepository.existsById(slotId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Slot not found with id: " + slotId);
        }

        // ตรวจสอบว่ามีการบันทึกที่ชอบนี้อยู่แล้วหรือไม่
        Optional<Favorite> existing = favRepository.findByUserIdAndSlotIdAndRoomId(loggedInUserId, slotId, roomId);
        if (existing.isPresent()) {
            // ถ้ามีอยู่แล้ว ก็ส่งกลับ response เดิมได้เลย
            return convertToResponse(existing.get());
        }

        Favorite favorite = new Favorite(loggedInUserId, roomId, slotId);
        Favorite saved = favRepository.save(favorite);
        return convertToResponse(saved);
    }

    public List<MyFavoriteResponse> getFavoritesByUser(UUID userId) {
        List<Favorite> favorites = favRepository.findByUserId(userId);
        return favorites.stream().map(this::convertToResponse).toList();
    }

    @Transactional
    public boolean deleteFavorite(UUID favoriteId, UUID loggedInUserId) {

        Optional<Favorite> favoriteOpt = favRepository.findById(favoriteId);

        if (favoriteOpt.isEmpty()) {
            return false; // ไม่เจอ
        }

        Favorite favorite = favoriteOpt.get();

        //ตรวจสอบความเป็นเจ้าของ
        if (!favorite.getUserId().equals(loggedInUserId)) {
            return false; // เจอแต่ไม่ใช่เจ้าของ
        }

        // ถ้าเจอ และ เป็นเจ้าของ
        favRepository.delete(favorite);
        return true;
    }

    private MyFavoriteResponse convertToResponse(Favorite fav) {
        Optional<Rooms> roomOpt = roomRepository.findById(fav.getRoomId());
        Optional<Slot> slotOpt = slotRepository.findById(fav.getSlotId());

        Rooms room = roomOpt.get();
        Slot slot = slotOpt.get();

        // ดึงข้อมูลจาก Room และ Slot
        String type = room.getType();
        String name = room.getName();
        String locationName = room.getLoc_name();
        LocalTime startTime =slot.getSlotTime();
        LocalTime endTime = startTime.plusHours(DURATION);

        return new MyFavoriteResponse(
                fav.getFavoriteId(),
                fav.getRoomId(),
                fav.getSlotId(),
                type,
                name,
                locationName,
                startTime,
                endTime
        );
    }
}
