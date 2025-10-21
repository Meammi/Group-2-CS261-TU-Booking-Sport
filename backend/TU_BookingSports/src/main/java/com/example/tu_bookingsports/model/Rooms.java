//backend\TU_BookingSports\src\main\java\com\example\tu_bookingsports\model\Rooms.java
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

    public Rooms(String name, String type, int capacity, String loc_name, GeoLocation location, BigDecimal price, LocalDateTime created_at, LocalDateTime updated_at) {
        this.name = name;
        this.type = type;
        this.capacity = capacity;
        this.loc_name = loc_name;
        this.location = location;
        this.price = price;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Rooms() {}

    public UUID getRoom_id() {
        return room_id;
    }

    public void setRoom_id(UUID room_id) {
        this.room_id = room_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public String getLoc_name() {
        return loc_name;
    }

    public void setLoc_name(String loc_name) {
        this.loc_name = loc_name;
    }

    public GeoLocation getLocation() {
        return location;
    }

    public void setLocation(GeoLocation location) {
        this.location = location;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public LocalDateTime getCreated_at() {
        return created_at;
    }

    public void setCreated_at(LocalDateTime created_at) {
        this.created_at = created_at;
    }

    public LocalDateTime getUpdated_at() {
        return updated_at;
    }

    public void setUpdated_at(LocalDateTime updated_at) {
        this.updated_at = updated_at;
    }
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

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
}

@Data
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

    public Long getSlotId() {
        return slotId;
    }

    public void setSlotId(Long slotId) {
        this.slotId = slotId;
    }

    public Rooms getRoom() {
        return room;
    }

    public void setRoom(Rooms room) {
        this.room = room;
    }

    public LocalTime getSlotTime() {
        return slotTime;
    }

    public void setSlotTime(LocalTime slotTime) {
        this.slotTime = slotTime;
    }

    public SlotStatus getStatus() {
        return status;
    }

    public void setStatus(SlotStatus status) {
        this.status = status;
    }
}