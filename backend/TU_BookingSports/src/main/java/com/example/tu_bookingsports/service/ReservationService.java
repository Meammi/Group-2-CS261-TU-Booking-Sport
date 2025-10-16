package com.example.tu_bookingsports.service;

import com.example.tu_bookingsports.model.Reservations;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class ReservationService {
    private final com.example.tu_bookingsports.repository.ReservationRepository reservationRepository;

    public ReservationService(com.example.tu_bookingsports.repository.ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    public BigDecimal getPriceByReservationId(UUID reservationId) {
        Reservations reservation = reservationRepository.findByReservationId(reservationId);
        return reservation.getPrice();
    }

}