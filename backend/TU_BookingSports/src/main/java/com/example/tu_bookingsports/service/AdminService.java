package com.example.tu_bookingsports.service;

import com.example.tu_bookingsports.model.AdminAuditLog;
import com.example.tu_bookingsports.model.Rooms;
import com.example.tu_bookingsports.model.Slot;
import com.example.tu_bookingsports.model.User;
import com.example.tu_bookingsports.repository.AdminAuditLogRepository;
import com.example.tu_bookingsports.repository.RoomRepository;
import com.example.tu_bookingsports.repository.SlotRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

// Excerpt for Team: update endpoints
@Service
public class AdminService {
    private final AdminAuditLogRepository auditLogRepository;
    private final RoomRepository roomRepository;
    private final SlotRepository slotRepository;

    @Value("${ADMIN_EMAILS}")
    private String adminEmails;

    private Set<String> adminEmailsSet;

    public AdminService_Team(AdminAuditLogRepository auditLogRepository,
                             RoomRepository roomRepository,
                             SlotRepository slotRepository) {
        this.auditLogRepository = auditLogRepository;
        this.roomRepository = roomRepository;
        this.slotRepository = slotRepository;
    }

    @PostConstruct
    public void init() { adminEmailsSet = new HashSet<>(Arrays.asList(adminEmails.split(","))); }

    public boolean isAdmin(User user) { return user != null && adminEmailsSet.contains(user.getEmail()); }

    private void logAdminAction(User admin, AdminAuditLog.ActionType action, AdminAuditLog.EntityType entityType,
                               String entityId, String details) {
        AdminAuditLog log = new AdminAuditLog();
        log.setAdminId(admin);
        log.setAction(action);
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setDetails(details);
        auditLogRepository.save(log);
    }

    @Transactional
    public Rooms updateRoom(UUID roomId, Rooms updatedRoomData, User admin) {
        Rooms room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + roomId));

        if (updatedRoomData.getName() != null) room.setName(updatedRoomData.getName());
        if (updatedRoomData.getType() != null) room.setType(updatedRoomData.getType());
        if (updatedRoomData.getCapacity() > 0) room.setCapacity(updatedRoomData.getCapacity());
        if (updatedRoomData.getLoc_name() != null) room.setLoc_name(updatedRoomData.getLoc_name());
        if (updatedRoomData.getPrice() != null) room.setPrice(updatedRoomData.getPrice());

        logAdminAction(admin, AdminAuditLog.ActionType.UPDATE, AdminAuditLog.EntityType.ROOM, roomId.toString(),
                "Updated room: " + room.getName());

        return roomRepository.save(room);
    }

    @Transactional
    public Slot updateSlot(UUID slotId, Slot updatedSlotData, User admin) {
        Slot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found with id: " + slotId));

        if (updatedSlotData.getStatus() != null) {
            slot.setStatus(updatedSlotData.getStatus());
        }
        if (updatedSlotData.getSlotTime() != null) {
            slot.setSlotTime(updatedSlotData.getSlotTime());
        }

        logAdminAction(admin, AdminAuditLog.ActionType.UPDATE, AdminAuditLog.EntityType.SLOT, slotId.toString(),
                "Updated slot status to " + slot.getStatus() + " for room " + slot.getRoom().getName());

        return slotRepository.save(slot);
    }
}
