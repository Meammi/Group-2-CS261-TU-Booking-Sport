package com.example.tu_bookingsports.service;


import com.example.tu_bookingsports.DTO.MyBookingResponse;
import com.example.tu_bookingsports.model.Reservations;
import com.example.tu_bookingsports.model.Rooms;
import com.example.tu_bookingsports.model.Slot;
import com.example.tu_bookingsports.repository.HomepageRepository;
import com.example.tu_bookingsports.repository.MyBookingRepository;
import com.example.tu_bookingsports.repository.SlotRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;


@Service
public class MyBookingService {

    private final MyBookingRepository bookingRepository;
    private final HomepageRepository roomRepository;
    private final SlotRepository slotRepository;

    public MyBookingService(MyBookingRepository bookingRepository, HomepageRepository roomRepository, SlotRepository slotRepository) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
        this.slotRepository = slotRepository;
    }

    public List<MyBookingResponse> getCurrentBookings(UUID userId) {
        List<Reservations> myBookings = bookingRepository.findByUser(userId);
        LocalDateTime now = LocalDateTime.now();

        return myBookings.stream()
                .filter(b ->
                        (b.getStatus() == Reservations.ReservationStatus.CONFIRMED ||
                                b.getStatus() == Reservations.ReservationStatus.PENDING)
                                && b.getEndTime().isAfter(now)
                )
                .map(b -> {
                    Rooms room = roomRepository.findById(b.getRoom()).orElse(null);
                    if (room == null) return null;

                    return new MyBookingResponse(
                            b.getReservationID(),
                            room.getName(),
                            room.getLoc_name(),
                            b.getStartTime(),
                            b.getEndTime(),
                            true,
                            b.getStatus()
                    );
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    public List<MyBookingResponse> getHistoryBookings(UUID userId) {
        List<Reservations> myBookings = bookingRepository.findByUser(userId);
        LocalDateTime now = LocalDateTime.now();

        return myBookings.stream()
                .filter(b ->
                        b.getEndTime().isBefore(now) &&
                                b.getStatus() == Reservations.ReservationStatus.CONFIRMED
                )
                .map(b -> {
                    Rooms room = roomRepository.findById(b.getRoom()).orElse(null);
                    if (room == null) return null;

                    return new MyBookingResponse(
                            b.getReservationID(),
                            room.getName(),
                            room.getLoc_name(),
                            b.getStartTime(),
                            b.getEndTime(),
                            false,
                            b.getStatus()
                    );
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    @Transactional
    public boolean cancelBooking(UUID reservationId) {
        Optional<Reservations> optionalReservation = bookingRepository.findById(reservationId);

        if (optionalReservation.isPresent()) {
            Reservations reservation = optionalReservation.get();

            // ถ้า status เป็น CANCELLED อยู่แล้ว ไม่ต้องทำอะไร
            if (reservation.getStatus() == Reservations.ReservationStatus.CANCELLED) {
                return false;
            }

            // ตรวจสอบว่าเวลาจองหมดแล้วหรือยัง
            LocalDateTime now = LocalDateTime.now();
            if (reservation.getEndTime().isBefore(now)) {
                // ถ้าการจองหมดเวลาแล้ว (อยู่ใน history) ห้าม cancel
                return false;
            }

            // ดำเนินการ cancel ปกติ
            reservation.setStatus(Reservations.ReservationStatus.CANCELLED);
            bookingRepository.save(reservation);

            // ปลด slot กลับไปเป็น AVAILABLE
            UUID slotId = reservation.getSlotId();
            if (slotId != null) {
                Optional<Slot> optSlot = slotRepository.findById(slotId);
                if (optSlot.isPresent()) {
                    Slot slot = optSlot.get();
                    slot.setStatus(Slot.SlotStatus.AVAILABLE);
                    slotRepository.save(slot);
                }
            }
            return true;
        }
        return false;
    }
}
