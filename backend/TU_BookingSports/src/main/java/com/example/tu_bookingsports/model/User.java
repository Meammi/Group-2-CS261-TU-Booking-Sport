package com.example.tu_bookingsports.model;

import jakarta.persistence.*;
import org.hibernate.annotations.Nationalized;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "user_id", columnDefinition = "uniqueidentifier", updatable = false, nullable = false)
    private UUID userId;

    @Column(name = "type")
    private String type; // employee or student

    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    // Legacy column kept for backward-compatibility with existing schema (NOT NULL in DB)
    @Column(name = "password")
    private String password;

    @Nationalized
    @Column(name = "tu_status", columnDefinition = "NVARCHAR(255)")
    private String tuStatus;

    @Column(name = "statusid")
    private String statusId;

    @Nationalized
    @Column(name = "displayname_th", columnDefinition = "NVARCHAR(255)")
    private String displayNameTh;

    @Nationalized
    @Column(name = "displayname_en", columnDefinition = "NVARCHAR(255)")
    private String displayNameEn;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public User() { }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public UUID getUserId() { return userId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getTuStatus() { return tuStatus; }
    public void setTuStatus(String tuStatus) { this.tuStatus = tuStatus; }

    public String getStatusId() { return statusId; }
    public void setStatusId(String statusId) { this.statusId = statusId; }

    public String getDisplayNameTh() { return displayNameTh; }
    public void setDisplayNameTh(String displayNameTh) { this.displayNameTh = displayNameTh; }

    public String getDisplayNameEn() { return displayNameEn; }
    public void setDisplayNameEn(String displayNameEn) { this.displayNameEn = displayNameEn; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
