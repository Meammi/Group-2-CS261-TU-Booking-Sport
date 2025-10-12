package com.example.tu_bookingsports.repository;

import com.example.tu_bookingsports.model.Rooms;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface RoomRepository extends JpaRepository<Rooms,UUID>{
    // เมธอดสำหรับดึงข้อมูล Projection
    //List<Rooms> findByTypeAndLoc_name(String type, String loc_name);
    @Query("SELECT r FROM Rooms r WHERE r.type = :type AND r.loc_name = :loc_name")
    List<Rooms> findByTypeAndLoc_name(@Param("type") String type, @Param("loc_name") String loc_name);

    //List<RoomProjection> findAllBy();
    /*interface RoomProjection {
        // Getter ต้องตรงกับชื่อฟิลด์ใน Rooms Entity
        String getType();
        String getLocName();
    }*/

}