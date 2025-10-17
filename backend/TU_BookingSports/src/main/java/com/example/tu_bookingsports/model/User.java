//C:\Users\print\OneDrive\Desktop\MyWork\CS261\Group-2-CS261-TU-Booking-Sport\backend\src\main\java\com\example\tu_bookingsports\model\User.java
package com.example.tu_bookingsports.model;

import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

//@Data
@Entity
@Table(name = "users")
public class User {

    // 1. user_id (uuid, Primary Key)
    // @Id: กำหนดให้เป็น Primary Key
    // @GeneratedValue: ตั้งค่าให้ ID ถูกสร้างขึ้นโดยอัตโนมัติ (ในที่นี้เราใช้ UUID)
    // @Column(columnDefinition = "uuid", updatable = false): กำหนดประเภทคอลัมน์และป้องกันการอัปเดต
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "user_id", columnDefinition = "uniqueidentifier", updatable = false, nullable = false)
    private UUID userId;

    // 2. role (text, NN - Not Null)
    @Column(nullable = false)
    private String role;


    @Column(name = "email", nullable = false, unique = true)
    private String email;

    // 4. username (text, NN - Not Null)
    @Column(nullable = false)
    private String username;

    // 5. password (text, NN - Not Null)
    @Column(name = "password", nullable = false)
    private String password;

    // 6. phone_number (text) - อนุญาตให้เป็น Null
    @Column(name = "phone_number")
    private String phoneNumber;

    // 7. created_at (timestamptz, NN - Not Null)
    // @PrePersist: กำหนดค่าอัตโนมัติเมื่อมีการสร้าง (Persist) Entity ครั้งแรก
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // 8. updated_at (timestamptz, NN - Not Null)
    // @PreUpdate: กำหนดค่าอัตโนมัติเมื่อมีการอัปเดต Entity
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // --- Constructors ---
    public User() {
        super();
    }

    // Constructor สำหรับการสร้าง object ใหม่ (ไม่รวม ID, created_at, updated_at)
    public User(String role, String email, String username, String password, String phoneNumber) {
        super();
        this.role = role;
        this.email = email;
        this.username = username;
        this.password = password;
        this.phoneNumber = phoneNumber;
    }

    // --- Lifecycle Callbacks (สำหรับ Timestamps) ---

    // กำหนดค่า created_at และ updated_at ก่อนการบันทึกครั้งแรก
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // อัปเดต updated_at ทุกครั้งก่อนการอัปเดตข้อมูล
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }


    // --- Getters and Setters (รวมที่จำเป็น) ---

    public UUID getUserId() {
        return userId;
    }

    // ไม่ควรมี setUserId เพื่อป้องกันการเปลี่ยนแปลง ID

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    // ... เพิ่ม Getter/Setter สำหรับฟิลด์อื่นๆ (email, username, password, phoneNumber, createdAt, updatedAt) ...

    // ตัวอย่าง Getter/Setter สำหรับ email
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    // ตัวอย่าง Getter/Setter สำหรับ username
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    // ... (ฟิลด์อื่น ๆ ตามความจำเป็น) ...

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}