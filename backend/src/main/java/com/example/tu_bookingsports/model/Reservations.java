package com.example.tu_bookingsports.model;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.UUID;
import java.time.LocalDateTime;
import java.time.LocalTime;

import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
@Data
@Entity
@Table(name = "reservations")
public class Reservations {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(name = "reservation_id" , updatable = false , nullable = false)
    private UUID reservationId;

    @Column(name = "room_id", nullable = false)
    private UUID room;

    @Column(name = "user_id", nullable = false)
    private UUID user;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    public enum ReservationStatus {
        PENDING,     // 0 รอการยืนยัน
        CONFIRMED,   // 1 ยืนยันแล้ว
        CANCELLED,   // 2 ยกเลิก
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ReservationStatus status;

    @Column(name = "created", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated", nullable = false)
    private LocalDateTime updatedAt;
    @Column(name = "price",nullable = false,precision = 10,scale = 2)

    private BigDecimal price;
    //Constuctor
    public Reservations() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = ReservationStatus.PENDING;
    }

    public Reservations(UUID room, UUID user, LocalTime startTime, LocalTime endTime, ReservationStatus status) {
        this.room = room;
        this.user = user;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status != null ? status : ReservationStatus.PENDING;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }


}