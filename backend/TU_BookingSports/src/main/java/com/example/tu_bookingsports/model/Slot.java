package com.example.tu_bookingsports.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

import lombok.Data;
import org.hibernate.annotations.GenericGenerator;

@Data
@Entity
@Table(name = "slots")
public class Slot {


    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    //@Column(name = "slot_id")
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "slot_id", columnDefinition = "uniqueidentifier")
    private UUID slotId;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    private Rooms room;


    @Column(name = "slot_time", nullable = false)
    private LocalTime slotTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private SlotStatus status;

    public enum SlotStatus {
        AVAILABLE,
        BOOKED,
        MAINTENANCE
    }

    public Slot(SlotStatus status, LocalTime slotTime, Rooms room) {
        this.status = status;
        this.slotTime = slotTime;
        this.room = room;
    }
    public Slot(){}

    public UUID getSlotId() {
        return slotId;
    }

    public Rooms getRoom() {
        return room;
    }

    public LocalTime getSlotTime() {
        return slotTime;
    }

    public SlotStatus getStatus() {
        return status;
    }

    public void setSlotId(UUID slotId) {
        this.slotId = slotId;
    }

    public void setRoom(Rooms room) {
        this.room = room;
    }

    public void setSlotTime(LocalTime slotTime) {
        this.slotTime = slotTime;
    }

    public void setStatus(SlotStatus status) {
        this.status = status;
    }
}