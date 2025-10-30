package com.example.tu_bookingsports.controller;

import com.example.tu_bookingsports.DTO.FavoriteRequest;
import com.example.tu_bookingsports.DTO.MyFavoriteResponse;
import com.example.tu_bookingsports.model.User;
import com.example.tu_bookingsports.service.AuthService;
import com.example.tu_bookingsports.service.MyFavoriteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/favorite")
public class FavoriteController {

    private final MyFavoriteService favoriteService;
    private final AuthService authService;

    public FavoriteController(MyFavoriteService favoriteService, AuthService authService) {
        this.favoriteService = favoriteService;
        this.authService = authService;
    }

    @PostMapping("/create")
    public ResponseEntity<MyFavoriteResponse> createFavorite(@RequestBody FavoriteRequest req,
                                                           @CookieValue(value = "access_token", required = false) String token //ดึง token จาก cookie
    ){
        if (token == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing access_token cookie");
        }

        User user = authService.getCurrentUser(token);

        UUID loggedInUserId = user.getUserId();
        MyFavoriteResponse response = favoriteService.createFavorite(req, loggedInUserId);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<List<MyFavoriteResponse>> getFavoritesByUser(@CookieValue(value = "access_token", required = false) String token) {
        if (token == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing access_token cookie");
        }

        User user = authService.getCurrentUser(token);

        UUID loggedInUserId = user.getUserId();
        List<MyFavoriteResponse> favorites = favoriteService.getFavoritesByUser(loggedInUserId);

        return ResponseEntity.ok(favorites);
    }

    @DeleteMapping("/delete/{favoriteId}")
    public ResponseEntity<String> deleteFavorite(@PathVariable UUID favoriteId,
                                                 @CookieValue(value = "access_token", required = false) String token
    ){
        if (token == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing access_token cookie");
        }

        User user = authService.getCurrentUser(token);

        UUID loggedInUserId = user.getUserId();
        boolean deleted = favoriteService.deleteFavorite(favoriteId, loggedInUserId);
        if (deleted) {
            return ResponseEntity.ok("Favorite deleted successfully");
        }
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Favorite not found or you don't have permission");
    }
}
