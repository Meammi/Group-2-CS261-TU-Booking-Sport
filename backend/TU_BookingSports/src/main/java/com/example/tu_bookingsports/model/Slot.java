package com.example.tu_bookingsports.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.LocalTime;
import lombok.Data;
import org.hibernate.annotations.GenericGenerator;

@Data
@Entity
@Table(name = "slots")
public class Slot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "slot_id")
    private Long slotId;

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

    public Long getSlotId() {
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

}