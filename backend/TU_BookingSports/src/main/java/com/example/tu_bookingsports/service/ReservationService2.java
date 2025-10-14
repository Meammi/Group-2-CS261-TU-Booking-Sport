package com.example.tu_bookingsports.service;

import com.example.tu_bookingsports.model.Reservations;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

//          |
//boss code V

import com.example.tu_bookingsports.DTO.ReservationRequest;
import com.example.tu_bookingsports.model.Reservations;
import com.example.tu_bookingsports.model.Rooms;
import com.example.tu_bookingsports.model.Slot;
import com.example.tu_bookingsports.model.Slot.SlotStatus;
import com.example.tu_bookingsports.model.Reservations.ReservationStatus;
import com.example.tu_bookingsports.repository.ReservationRepository;
import com.example.tu_bookingsports.repository.SlotRepository;
import com.example.tu_bookingsports.repository.RoomRepository; // ต้องใช้ RoomRepository ด้วย
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Optional;
import java.util.UUID;

// สมมติว่ามี PaymentService และ DTOs สำหรับการชำระเงินอยู่ในโปรเจ็กต์แล้ว
//import com.example.tu_bookingsports.DTO.PaymentRequest;
//import com.example.tu_bookingsports.service.PaymentService;
import com.google.zxing.WriterException;
import java.io.IOException;

//  ^
//  |

@Service
public class ReservationService2 {



    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private RoomRepository roomRepository; // ต้องมีการ Autowired RoomRepository

    //@Autowired // ใช้ required = false ถ้ายังไม่มี PaymentService จริง
    //private PaymentService paymentService;


    /**
     * ขั้นตอนที่ 1: สร้าง Reservation (สถานะ PENDING) และตั้งค่า Slot เป็น BOOKED
     */
    @Transactional
    public Reservations createReservation(ReservationRequest request) {
        UUID slotId = request.getSlotId();
        UUID roomId = request.getRoomId();

        // 1. เช็คว่า Slot มีอยู่จริงและสัมพันธ์กับ Room ID ที่ส่งมาหรือไม่
        Slot slot = slotRepository.findBySlotIdAndRoom_RoomId(slotId, roomId);

        // A. ถ้าไม่มี slot/room ที่ตรงกัน
        if (slot == null) {
            throw new RuntimeException("Error: Slot ID or Room ID is invalid or mismatched.");
        }
        //Slot slot = optionalSlot.orElseThrow(
        //        () -> new RuntimeException("Error: Slot ID or Room ID is invalid or mismatched.")
        //);

        // B. ถ้า status slot เป็น BOOKED
        if (slot.getStatus() == SlotStatus.BOOKED) {
            throw new RuntimeException("Error, This court was reserve!");
        }

        // 2. ถ้า AVAILABLE ให้เปลี่ยน status slot เป็น BOOKED
        slot.setStatus(SlotStatus.BOOKED);
        slotRepository.save(slot); // บันทึกสถานะ slot ที่เปลี่ยนไป

        // 3. ดึงข้อมูล Room เพื่อหา Price และ Time
        Optional<Rooms> roomOpt = roomRepository.findById(roomId);
        if (!roomOpt.isPresent()) {
            // ควรจะถูกจับตั้งแต่ findBySlotIdAndRoomRoomId แล้ว แต่เพื่อความปลอดภัย
            throw new RuntimeException("Room not found.");
        }
        Rooms room = roomOpt.get();
        LocalTime startTime = slot.getSlotTime();
        // start_time + 1 ชม.
        LocalTime endTime = startTime.plusHours(1);

        // 4. สร้าง Reservations
        Reservations reservation = new Reservations();
        reservation.setRoom(roomId);
        reservation.setUser(request.getUserId());
        reservation.setStartTime(startTime);
        reservation.setEndTime(endTime);
        reservation.setPrice(room.getPrice()); // ใช้ price จาก Rooms
        reservation.setStatus(ReservationStatus.PENDING); // สถานะเริ่มต้นเป็น PENDING
        reservation.setSlotId(slotId);

        // 5. บันทึก Reservation และส่งกลับ
        return reservationRepository.save(reservation);
    }

    //----------------------------------------------------------------------

    /**
     * ขั้นตอนที่ 2: จัดการการ Cancel
     */
    @Transactional
    public Reservations cancelReservation(UUID reservationId) {
        Optional<Reservations> resOpt = reservationRepository.findById(reservationId);
        if (!resOpt.isPresent()) {
            throw new RuntimeException("Error: Reservation not found.");
        }

        Reservations reservation = resOpt.get();

        // 1. เปลี่ยนสถานะ Reservation เป็น CANCELLED
        reservation.setStatus(ReservationStatus.CANCELLED);
        // @PreUpdate จะจัดการ updatedAt อัตโนมัติ แต่ตั้งค่าตรงๆ ก็ปลอดภัย
        reservation.setUpdatedAt(LocalDateTime.now());
        reservationRepository.save(reservation);

        // 2. คืนสถานะ Slot ให้เป็น AVAILABLE (ต้องดึง slot ID จาก Reservation)
        // เนื่องจาก Reservations entity ของคุณขาด slot_id เราจะหา slot จาก room ID และ start_time
        // NOTE: หากคุณปรับ Reservations model ให้มี slot_id จะง่ายกว่ามาก
        //Slot slotToUpdate = slotRepository.findByRoom_RoomIdAndSlotTime(
        //        reservation.getRoom(),
        //        reservation.getStartTime()
        //);
        Slot slotToUpdate = slotRepository.findBySlotIdAndRoom_RoomId(
                reservation.getSlotId(),
                reservation.getRoom()
        );

        if (slotToUpdate != null) {
            slotToUpdate.setStatus(SlotStatus.AVAILABLE);
            slotRepository.save(slotToUpdate);
        }

        return reservation;
    }

    /**
     * ขั้นตอนที่ 3: จัดการการ Confirm (ไปหน้า Payment หรือยืนยันทันที)
     */
    @Transactional
    public Object confirmReservation(UUID reservationId) throws IOException, WriterException {
        Optional<Reservations> resOpt = reservationRepository.findById(reservationId);
        if (!resOpt.isPresent()) {
            throw new RuntimeException("Error: Reservation not found.");
        }

        Reservations reservation = resOpt.get();
        reservation.setUpdatedAt(LocalDateTime.now()); // ตั้งค่า update_at

        BigDecimal price = reservation.getPrice() != null ? reservation.getPrice() : BigDecimal.ZERO;

        // 1. ถ้า price == 0
        if (price.compareTo(BigDecimal.ZERO) <= 0) {
            reservation.setStatus(ReservationStatus.CONFIRMED);
            return reservationRepository.save(reservation); // บันทึกและส่ง Reservation กลับ
        }
        // 2. ถ้า price > 0 ให้เรียก Payment Service
        else {
            reservationRepository.save(reservation); // บันทึก update_at ก่อนเรียก payment

            //if (paymentService == null) {
                // สำหรับกรณีที่ยังไม่ได้สร้าง PaymentService จริง
            //    throw new RuntimeException("Payment service is not configured.");
            //}

            // เรียก Payment Service
            //////////////<-เอาcommentออกถ้าbenจะรันรวมintegrateหมด return paymentService.createPayment(reservation.getReservationId());
            return "creating payment";
        }
    }


}

