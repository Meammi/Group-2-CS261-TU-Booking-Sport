package com.example.tu_bookingsports.repository;
import com.example.tu_bookingsports.model.Reservations;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.Optional;

public interface RoomRepository extends JpaRepository<Reservations,UUID>{
    // เมธอดสำหรับดึงข้อมูล Projection
    List<Rooms> findByTypeAndLocName(String type, String locName);

    //List<RoomProjection> findAllBy();
    /*interface RoomProjection {
        // Getter ต้องตรงกับชื่อฟิลด์ใน Rooms Entity
        String getType();
        String getLocName();
    }*/

}