package com.example.tu_bookingsports.service;

import com.example.tu_bookingsports.DTO.AdminRequest;
import com.example.tu_bookingsports.model.AdminAuditLog;
import com.example.tu_bookingsports.model.Rooms;
import com.example.tu_bookingsports.model.Slot;
import com.example.tu_bookingsports.model.User;
import com.example.tu_bookingsports.repository.AdminAuditLogRepository;
import com.example.tu_bookingsports.repository.RoomRepository;
import com.example.tu_bookingsports.repository.SlotRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Pageable;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;


@Service
public class AdminService {
    private final AdminAuditLogRepository auditLogRepository;
    private final RoomRepository roomRepository;
    private final SlotRepository slotRepository;

    @Value("${ADMIN_EMAILS}")
    private String adminEmails;

    private Set<String> adminEmailsSet;

    public AdminService(AdminAuditLogRepository auditLogRepository,
                             RoomRepository roomRepository,
                             SlotRepository slotRepository) {
        this.auditLogRepository = auditLogRepository;
        this.roomRepository = roomRepository;
        this.slotRepository = slotRepository;
    }

    @PostConstruct
    public void init() { adminEmailsSet = new HashSet<>(Arrays.asList(adminEmails.split(","))); }

    public boolean isAdmin(User user) { return user != null && adminEmailsSet.contains(user.getEmail()); }

    public List<AdminAuditLog> getAuditLogs() {
        return auditLogRepository.findAll();
    }

    public Page<Rooms> getAllRooms(Pageable pageable) {
        if (pageable.getSort().isUnsorted()) {
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by("orderId"));
        }
        return roomRepository.findAll(pageable);
    }

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
    public Slot createSlotForRoom(AdminRequest request, User admin) {
        var room = roomRepository.findById(request.getRoom().getRoom_id())
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + request.getRoom().getRoom_id()));

        Slot existingSlot = slotRepository.findByRoomIdAndSlotTimeNative(room.getRoom_id(), request.getSlotTime().toString());
        if (existingSlot != null) {
            throw new RuntimeException("A slot for this room at " + request.getSlotTime() + " already exists.");
        }

        Slot newSlot = new Slot();
        newSlot.setRoom(room);
        newSlot.setSlotTime(request.getSlotTime());
        newSlot.setStatus(request.getStatus() != null ? request.getStatus() : Slot.SlotStatus.AVAILABLE);
        newSlot = slotRepository.save(newSlot);

        logAdminAction(admin, AdminAuditLog.ActionType.CREATE, AdminAuditLog.EntityType.SLOT, newSlot.getSlotId().toString(),
                "Created new slot for room " + newSlot.getRoom().getName() + " at " + newSlot.getSlotTime());

        return newSlot;
    }

    @Transactional
    public Rooms createRoom(Rooms room, User admin) {
        Rooms newRoom = roomRepository.save(room);

        logAdminAction(admin, AdminAuditLog.ActionType.CREATE, AdminAuditLog.EntityType.ROOM, newRoom.getRoom_id().toString(),
                "Created new room: " + newRoom.getName());

        return newRoom;
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
    public List<Slot> getAllSlotsForRoom(UUID roomId) {
        return slotRepository.findSlotsByRoomId(roomId);
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

    @Transactional
    public void deleteRoomAndAssociatedSlots(UUID roomId, User admin) {
        Rooms room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + roomId));

        logAdminAction(admin, AdminAuditLog.ActionType.DELETE, AdminAuditLog.EntityType.SLOT, roomId.toString(),
                "Deleted all slots for room " + room.getName());

        slotRepository.deleteByRoomId(roomId);

        logAdminAction(admin, AdminAuditLog.ActionType.DELETE, AdminAuditLog.EntityType.ROOM, roomId.toString(),
                "Deleted room: " + room.getName());

        roomRepository.deleteById(roomId);
    }

    @Transactional
    public void deleteSlot(UUID slotId, User admin) {
        Slot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found with id: " + slotId));

        logAdminAction(admin, AdminAuditLog.ActionType.DELETE, AdminAuditLog.EntityType.SLOT, slotId.toString(),
                "Deleted slot for room " + slot.getRoom().getName() + " at " + slot.getSlotTime());

        slotRepository.deleteById(slotId);
    }
}
