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
    @Column(name = "room_id",columnDefinition = "uniqueidentifier")
    private UUID roomId;

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


    public UUID getRoom_id() {
        return roomId;
    }

    public String getName() {
        return name;
    }

    public String getType() {
        return type;
    }

    public int getCapacity() {
        return capacity;
    }

    public String getLoc_name() {
        return loc_name;
    }

    public GeoLocation getLocation() {
        return location;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public LocalDateTime getCreated_at() {
        return created_at;
    }

    public LocalDateTime getUpdated_at() {
        return updated_at;
    }

    public void setRoomId(UUID roomId) { this.roomId = roomId; }
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