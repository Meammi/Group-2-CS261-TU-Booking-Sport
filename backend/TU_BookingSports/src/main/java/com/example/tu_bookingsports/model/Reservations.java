//C:\Users\print\OneDrive\Desktop\MyWork\CS261\Group-2-CS261-TU-Booking-Sport\backend\src\main\java\com\example\tu_bookingsports\model\Reservations.java
package com.example.tu_bookingsports.model;
import jakarta.persistence.*;
import java.util.UUID;
import java.time.LocalDateTime;
import java.time.LocalTime;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "reservations")
public class Reservations {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(name = "reservation_id" , updatable = false , nullable = false)
    private UUID reservationID;

    @Column(name = "room_id", nullable = false)
    private UUID room;

    @Column(name = "user_id", nullable = false)
    private UUID user;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

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
<<<<<<< HEAD

=======
>>>>>>> origin/main
    //Constuctor
    public Reservations() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = ReservationStatus.PENDING;
    }

    public Reservations(UUID room, UUID user, LocalDateTime startTime, LocalDateTime endTime, ReservationStatus status) {
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

    //Setter Getter
    public UUID getReservationID() {
        return reservationID;
    }

    public void setReservationID(UUID reservationID) {
        this.reservationID = reservationID;
    }

    public UUID getRoom() {
        return room;
    }

    public void setRoom(UUID room) {
        this.room = room;
    }

    public UUID getUser() {
        return user;
    }

    public void setUser(UUID user) {
        this.user = user;
    }


    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public ReservationStatus getStatus() {
        return status;
    }

    public void setStatus(ReservationStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

}