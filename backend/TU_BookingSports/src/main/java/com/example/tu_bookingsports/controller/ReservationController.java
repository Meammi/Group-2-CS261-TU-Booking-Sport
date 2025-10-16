package com.example.tu_bookingsports.controller;
import com.example.tu_bookingsports.service.ReservationService2;
import com.google.zxing.WriterException;
import org.springframework.web.bind.annotation.*;
import com.example.tu_bookingsports.service.RoomService;
import com.example.tu_bookingsports.DTO.RoomReservationDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import com.example.tu_bookingsports.model.Reservations.ReservationStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
//import com.example.tu_bookingsports.service.ReservationService;
//import com.example.tu_bookingsports.DTO.ConfirmationRequest;
import com.example.tu_bookingsports.DTO.ReservationRequest;
import com.example.tu_bookingsports.model.Reservations;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.UUID;



@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "") //ยิงจากท่ไหนก็ได้
public class ReservationController {
    private final RoomService roomService;
    private final ReservationService2 reservationService;


    public ReservationController(RoomService roomService, ReservationService2 reservationService) {
        this.roomService = roomService;
        this.reservationService = reservationService;
    }

    @GetMapping("/rooms")
    public List<RoomReservationDTO> getReservationView(
            @RequestParam(required = true) String type,
            @RequestParam(required = true) String locName) // type อาจถูกบังคับให้ส่งมา
    {
        // เรียก Service โดยส่งตัวกรองเข้าไป
        List<RoomReservationDTO> details = roomService.getRoomDetailsWithSlotsFiltered(type, locName);
        return details;
    }


    /**
     * Endpoint สำหรับสร้าง Reservation
     * (กดปุ่มเวลา)
     * POST /api/reservations/create
     *
    @PostMapping("/reservation/create")
    public ResponseEntity<?> createReservation(@RequestBody ReservationRequest request) {
        try {
        	Reservations newReservation = reservationService.createReservation(request);
            // ส่งค่าทั้งหมดใน reservation ที่สร้างกลับไป
            return ResponseEntity.status(HttpStatus.CREATED).body(newReservation);
        } catch (RuntimeException e) {
            // รับ Error จาก Service (เช่น "This court was reserve!")
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    /**
     * Endpoint สำหรับยกเลิก Reservation
     * (กดปุ่ม Cancel บนหน้า Confirmation)
     * POST /api/reservations/cancel
     *
    @PostMapping("/reservation/cancel")
    public ResponseEntity<?> cancelReservation(@RequestBody ConfirmationRequest request) {
        try {
        	Reservations cancelledReservation = reservationService.cancelReservation(request.getReservationId());
            return ResponseEntity.ok(cancelledReservation);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * Endpoint สำหรับยืนยัน Reservation
     * (กดปุ่ม Confirm บนหน้า Confirmation)
     * POST /api/reservations/confirm
     *
    @PostMapping("/reservation/confirm")
    public ResponseEntity<?> confirmReservation(@RequestBody ConfirmationRequest request) {
        try {
            // Service จะส่ง Reservation (ถ้า price=0) หรือ Payment object (ถ้า price>0) กลับมา
            Object result = reservationService.confirmReservation(request.getReservationId());
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IOException | WriterException e) {
            // กรณี Payment Service มีปัญหา
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Payment processing failed: " + e.getMessage());
        }
    }
    */

    @PostMapping("/reservation")
    public ResponseEntity<?> taskwithReservation(@RequestBody ReservationRequest request) {
        //final Logger log = LoggerFactory.getLogger(ReservationController.class);
        System.out.println("test test");
        System.out.println("getReservationId "+request.getReservationId());
        System.out.println("getRoomId "+request.getRoomId());
        System.out.println("getStatus "+request.getStatus());
        System.out.println("getSlotId "+request.getSlotId());
        //log.info("Processing data with ID: {}{}{}",request.getReservationId(),request.getRoomId(),request.getStatus());
        if (request.getReservationId()!= null && request.getStatus() != null){
            if (request.getStatus().toString() == "CONFIRMED") {
                try {
                    System.out.println("confirming");
                    Reservations result = reservationService.confirmReservation(request.getReservationId());
                    return ResponseEntity.ok(result);
                } catch (RuntimeException e) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
                }
                //return ResponseEntity.ok(request.getStatus().toString());


            }
            if (request.getStatus().toString() == "CANCELLED") {
                try {
                    System.out.println("CANCELling");
                    Reservations cancelledReservation = reservationService.cancelReservation(request.getReservationId());
                    return ResponseEntity.ok(cancelledReservation);
                } catch (RuntimeException e) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
                }
            }

        }
        if (request.getRoomId() != null && request.getUserId() != null && request.getSlotId() != null) {
            try {
                System.out.println("creating reservation");
                Reservations newReservation = reservationService.createReservation(request);
                return ResponseEntity.status(HttpStatus.CREATED).body(newReservation);
            } catch (RuntimeException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
            }
        }
        return null;
    }

}
