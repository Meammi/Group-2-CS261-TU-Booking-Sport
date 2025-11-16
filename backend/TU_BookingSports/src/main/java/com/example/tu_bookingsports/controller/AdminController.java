package com.example.tu_bookingsports.controller;

import com.example.tu_bookingsports.DTO.AdminRequest;
import com.example.tu_bookingsports.model.Rooms;
import com.example.tu_bookingsports.model.Slot;
import com.example.tu_bookingsports.model.User;
import com.example.tu_bookingsports.service.AdminService;
import com.example.tu_bookingsports.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;

import java.util.UUID;

// Excerpt for Team: PUT /admin/rooms/{roomId}, PUT /admin/slots/{slotId}
@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;
    private final AuthService authService;

    @PostMapping("/rooms")
    public ResponseEntity<?> createRoom(
            @RequestBody Rooms room,
            @CookieValue(value = "access_token", required = false) String token) {
        if (token == null || !authService.getJwtUtils().isTokenValid(token)) {
            return ResponseEntity.status(401).build();
        }
        User admin = authService.getCurrentUser(token);
        if (!adminService.isAdmin(admin)) {
            return ResponseEntity.status(403).build();
        }
        try {
            Rooms createdRoom = adminService.createRoom(room, admin);
            return ResponseEntity.ok(createdRoom);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/slots")
    public ResponseEntity<?> createSlot(
            @RequestBody AdminRequest request,
            @CookieValue(value = "access_token", required = false) String token) {
        if (token == null || !authService.getJwtUtils().isTokenValid(token)) {
            return ResponseEntity.status(401).build();
        }
        User admin = authService.getCurrentUser(token);
        if (!adminService.isAdmin(admin)) {
            return ResponseEntity.status(403).build();
        }
        try {
            Slot createdSlot = adminService.createSlotForRoom(request, admin);
            return ResponseEntity.ok(createdSlot);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/rooms/{roomId}")
    public ResponseEntity<?> updateRoom(
            @PathVariable UUID roomId,
            @RequestBody Rooms updatedRoom,
            @CookieValue(value = "access_token", required = false) String token) {
        if (token == null || !authService.getJwtUtils().isTokenValid(token)) {
            return ResponseEntity.status(401).build();
        }
        User admin = authService.getCurrentUser(token);
        if (!adminService.isAdmin(admin)) {
            return ResponseEntity.status(403).build();
        }
        try {
            Rooms room = adminService.updateRoom(roomId, updatedRoom, admin);
            return ResponseEntity.ok(room);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/slots/{slotId}")
    public ResponseEntity<?> updateSlot(
            @PathVariable UUID slotId,
            @RequestBody Slot updatedSlot,
            @CookieValue(value = "access_token", required = false) String token) {
        if (token == null || !authService.getJwtUtils().isTokenValid(token)) {
            return ResponseEntity.status(401).build();
        }
        User admin = authService.getCurrentUser(token);
        if (!adminService.isAdmin(admin)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(adminService.updateSlot(slotId, updatedSlot, admin));
    }

    @DeleteMapping("/rooms/{roomId}")
    public ResponseEntity<Void> deleteRoom(
            @PathVariable UUID roomId,
            @CookieValue(value = "access_token", required = false) String token) {
        if (token == null || !authService.getJwtUtils().isTokenValid(token)) {
            return ResponseEntity.status(401).build();
        }
        User admin = authService.getCurrentUser(token);
        if (!adminService.isAdmin(admin)) {
            return ResponseEntity.status(403).build();
        }
        adminService.deleteRoomAndAssociatedSlots(roomId, admin);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/slots/{slotId}")
    public ResponseEntity<Void> deleteSlot(
            @PathVariable UUID slotId,
            @CookieValue(value = "access_token", required = false) String token) {
        if (token == null || !authService.getJwtUtils().isTokenValid(token)) {
            return ResponseEntity.status(401).build();
        }
        User admin = authService.getCurrentUser(token);
        if (!adminService.isAdmin(admin)) {
            return ResponseEntity.status(403).build();
        }
        adminService.deleteSlot(slotId, admin);
        return ResponseEntity.ok().build();
    }
}
