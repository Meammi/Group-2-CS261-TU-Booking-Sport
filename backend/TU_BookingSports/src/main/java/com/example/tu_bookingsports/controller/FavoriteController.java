package com.example.tu_bookingsports.controller;

import com.example.tu_bookingsports.DTO.FavoriteRequest;
import com.example.tu_bookingsports.DTO.LoginRequest;
import com.example.tu_bookingsports.DTO.MyFavoriteResponse;
import com.example.tu_bookingsports.model.Favorite;
import com.example.tu_bookingsports.service.MyFavoriteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/favorite")
public class FavoriteController {

    private final MyFavoriteService myFavoriteService;

    public FavoriteController(MyFavoriteService myFavoriteService) {
        this.myFavoriteService = myFavoriteService;
    }

    @GetMapping("/{userId}")
    public Map<String, List<MyFavoriteResponse>> getFavData(@PathVariable UUID userId){
        List<MyFavoriteResponse> currentFav = myFavoriteService.getCurrentFavorite(userId);

        Map<String, List<MyFavoriteResponse>> response = new HashMap<>();
        response.put("current favorite", currentFav);

        return response;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createFavorite(@RequestBody FavoriteRequest req){
        Favorite newFavorite = myFavoriteService.createFavorite(req);

        return ResponseEntity.ok(newFavorite);
    }

    @DeleteMapping("/delete/{favoriteId}")
    public String deleteFav(@PathVariable UUID favoriteId) {
        boolean deleted = myFavoriteService.deleteFavorite(favoriteId);
        if (deleted) {
            return "Favorite deleted successfully";
        } else {
            return "Favorite not found or already deleted";
        }
    }
}
