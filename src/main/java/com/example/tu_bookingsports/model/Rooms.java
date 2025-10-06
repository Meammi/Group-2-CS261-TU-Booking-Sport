package com.example.tu_bookingsports.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Entity
@Table(name = "rooms")

public class Rooms {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long room_id;

    @Column(name = "name",nullable = false)
    private String name;

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
