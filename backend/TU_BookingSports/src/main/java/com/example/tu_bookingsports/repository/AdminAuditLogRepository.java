package com.example.tu_bookingsports.repository;

import com.example.tu_bookingsports.model.AdminAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminAuditLogRepository extends JpaRepository<AdminAuditLog, Long> {
    // Add custom queries if needed
}