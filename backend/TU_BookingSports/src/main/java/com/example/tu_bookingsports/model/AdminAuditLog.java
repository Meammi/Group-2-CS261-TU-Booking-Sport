package com.example.tu_bookingsports.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "admin_audit_logs")
public class AdminAuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "admin_id", nullable = false)
    private User adminId;

    public enum ActionType { // Made public
        CREATE,
        UPDATE,
        DELETE
    }

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ActionType action;

    public enum EntityType { // Made public
        USER,
        RESERVATION,
        ROOM,
        SLOT,
        PAYMENT,
        OTHER
    }

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EntityType entityType;

    @Column(nullable = false)
    private String entityId; // ID of the affected entity

    @Column(columnDefinition = "TEXT")
    private String details; // Additional details about the action

    @Column(nullable = false)
    private LocalDateTime timestamp;

    // No-arg constructor sets timestamp immediately (avoid @PrePersist lifecycle)
    public AdminAuditLog() {
        this.timestamp = LocalDateTime.now();
    }

    // Convenience constructor for creating audit entries in code
    public AdminAuditLog(User adminId, ActionType action, EntityType entityType, String entityId, String details) {
        this.adminId = adminId;
        this.action = action;
        this.entityType = entityType;
        this.entityId = entityId;
        this.details = details;
        this.timestamp = LocalDateTime.now();
    }
}