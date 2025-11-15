package com.example.tu_bookingsports.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
public class Favorite {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "favorite_id", nullable = false)
    private UUID favoriteId;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "room_id", nullable = false)
    private UUID roomId;

    @Column(name = "slot_id", nullable = false)
    private UUID slotId;

    @Column(name = "created", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated", nullable = false)
    private LocalDateTime updatedAt;

    public Favorite() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Favorite(UUID userId, UUID roomId, UUID slotId) {
        this.userId = userId;
        this.roomId = roomId;
        this.slotId = slotId;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

}
