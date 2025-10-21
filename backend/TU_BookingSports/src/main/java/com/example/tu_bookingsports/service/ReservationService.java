//backend\TU_BookingSports\src\main\java\com\example\tu_bookingsports\service\ReservationService.java
package com.example.tu_bookingsports.service;

import com.example.tu_bookingsports.model.Reservations;
import com.example.tu_bookingsports.model.Rooms;
import com.example.tu_bookingsports.repository.HomepageRepository;
import com.example.tu_bookingsports.repository.ReservationRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final HomepageRepository roomsRepository;

    public ReservationService(ReservationRepository reservationRepository, HomepageRepository roomsRepository) {
        this.reservationRepository = reservationRepository;
        this.roomsRepository = roomsRepository;
    }

    public BigDecimal getPriceByReservationId(UUID reservationId) {
        Reservations reservation = reservationRepository.findByReservationID(reservationId);
        if (reservation == null) {
            throw new IllegalArgumentException("Reservation not found: " + reservationId);
        }

        UUID roomId = reservation.getRoom();
        Rooms room = roomsRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Room not found: " + roomId));
        return room.getPrice();
    }

}
