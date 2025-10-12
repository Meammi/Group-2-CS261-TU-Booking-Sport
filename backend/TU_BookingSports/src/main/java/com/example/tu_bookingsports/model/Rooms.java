package com.example.tu_bookingsports.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.LocalTime;
import lombok.Data;
import org.hibernate.annotations.GenericGenerator;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Entity
@Table(name = "rooms")

public class Rooms {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(columnDefinition = "uniqueidentifier")
    private UUID room_id;

    @Column(name = "name",nullable = false)
    private String name;

    @Column(name = "type",nullable = false)
    private String type;



    @Column(name = "capacity",nullable = false)
    private int capacity;

    @Column(name = "loc_name",nullable = false)
    private String loc_name;

    @Embedded
    private GeoLocation location;


    @Column(name = "price",nullable = false,precision = 10,scale = 2)
    private BigDecimal price;

    @Column(name = "created_at",nullable = false)
    private LocalDateTime created_at;

    @Column(name = "updated_at",nullable = false)
    private LocalDateTime updated_at;


    @PrePersist
    public void prePersist() {
        created_at = LocalDateTime.now();
        updated_at = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updated_at = LocalDateTime.now();
    }
}
@Embeddable
class GeoLocation {
    private Double latitude;
    private Double longitude;
    public GeoLocation() {}
    public GeoLocation(Double latitude, Double longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

}

/*@Data
@Entity
@Table(name = "slots")
class Slot {

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


}*/