package com.example.tu_bookingsports.service;


import com.example.tu_bookingsports.DTO.MyBookingResponse;
import com.example.tu_bookingsports.model.Reservations;
import com.example.tu_bookingsports.model.Rooms;
import com.example.tu_bookingsports.repository.HomepageRepository;
import com.example.tu_bookingsports.repository.MyBookingRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;


@Service
public class MyBookingService {

    private final MyBookingRepository bookingRepository;
    private final HomepageRepository roomRepository;

    public MyBookingService(MyBookingRepository bookingRepository, HomepageRepository roomRepository) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
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
                        b.getStatus() == Reservations.ReservationStatus.CANCELLED ||
                                b.getEndTime().isBefore(now)
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

            // ถ้ายังไม่ CANCELLED หรือยังไม่หมดเวลา
            if (reservation.getStatus() != Reservations.ReservationStatus.CANCELLED) {
                //ลบออกจากฐานข้อมูลโดยตรง
                bookingRepository.delete(reservation);
                return true;
            }
        }
        return false;
    }
}
