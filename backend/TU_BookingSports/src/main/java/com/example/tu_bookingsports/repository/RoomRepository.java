package com.example.tu_bookingsports.repository;

import com.example.tu_bookingsports.model.Rooms;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;


public interface RoomRepository extends JpaRepository<Rooms,UUID>{
    // เมธอดสำหรับดึงข้อมูล Projection
    //List<Rooms> findByTypeAndLoc_name(String type, String loc_name);
    @Query("SELECT r FROM Rooms r WHERE r.type = :type AND r.loc_name = :loc_name")
    List<Rooms> findByTypeAndLoc_name(@Param("type") String type, @Param("loc_name") String loc_name);

    @Query("SELECT r FROM Rooms r WHERE r.loc_name = :locName")
    List<Rooms> findFirstByLocName(@Param("locName")String loc_name);

}