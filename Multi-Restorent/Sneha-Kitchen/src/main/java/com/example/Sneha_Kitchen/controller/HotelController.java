package com.example.Sneha_Kitchen.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.example.Sneha_Kitchen.model.HotelModel;
import com.example.Sneha_Kitchen.model.HotelMenu;
import com.example.Sneha_Kitchen.repository.HotelRepository;

import java.util.*;

@RestController
@RequestMapping("/hotels")

public class HotelController {

    @Autowired
    private HotelRepository hotelRepository;

    // ➕ Add new hotel (Only Shopkeeper/Admin can add)
    @PreAuthorize("hasAnyRole('SHOPKEEPER','ADMIN')")
    @PostMapping
    public ResponseEntity<?> addHotel(@RequestBody HotelModel hotel) {
        try {
            HotelModel savedHotel = hotelRepository.save(hotel);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "Hotel added successfully", "hotel", savedHotel));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to add hotel", "details", e.getMessage()));
        }
    }

    // 📜 Get all hotels (Accessible to all)
    @GetMapping
    public ResponseEntity<List<HotelModel>> getHotels() {
        List<HotelModel> hotels = hotelRepository.findAll();
        return ResponseEntity.ok(hotels);
    }

    // 🔍 Search hotels by name (Public)
    @GetMapping("/search")
    public ResponseEntity<List<HotelModel>> searchHotels(@RequestParam String name) {
        List<HotelModel> hotels = hotelRepository.findByHotelNameContainingIgnoreCase(name);
        return ResponseEntity.ok(hotels);
    }

    // 📌 Get single hotel by ID (Public)
    @GetMapping("/{id}")
    public ResponseEntity<?> getHotelById(@PathVariable String id) {
        return hotelRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Hotel not found with ID: " + id)));
    }

    // ➕ Add menu item to a hotel (Only Shopkeeper/Admin)
    @PreAuthorize("hasAnyRole('SHOPKEEPER','ADMIN')")
    @PostMapping("/{hotelId}/menu")
    public ResponseEntity<?> addMenuItem(@PathVariable String hotelId, @RequestBody HotelMenu menuItem) {
        return hotelRepository.findById(hotelId)
                .map(hotel -> {
                    if (hotel.getMenu() == null) {
                        hotel.setMenu(new ArrayList<>());
                    }
                    hotel.getMenu().add(menuItem);
                    HotelModel updatedHotel = hotelRepository.save(hotel);

                    return ResponseEntity.status(HttpStatus.CREATED)
                            .body(Map.of(
                                    "message", "Menu item added successfully to " + updatedHotel.getHotelName(),
                                    "menu", updatedHotel.getMenu()
                            ));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Hotel not found with ID: " + hotelId)));
    }

    // 🗑 Delete menu item by food name (Only Shopkeeper/Admin)
    @PreAuthorize("hasAnyRole('SHOPKEEPER','ADMIN')")
    @DeleteMapping("/{hotelId}/menu/{foodName}")
    public ResponseEntity<?> deleteMenuItem(@PathVariable String hotelId, @PathVariable String foodName) {
        return hotelRepository.findById(hotelId)
                .map(hotel -> {
                    if (hotel.getMenu() == null || hotel.getMenu().isEmpty()) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(Map.of("message", "No menu items to remove"));
                    }

                    boolean removed = hotel.getMenu().removeIf(item -> 
                        item.getFoodName() != null && item.getFoodName().equalsIgnoreCase(foodName)
                    );

                    if (!removed) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(Map.of("message", "Menu item not found: " + foodName));
                    }

                    HotelModel updated = hotelRepository.save(hotel);
                    return ResponseEntity.ok(Map.of(
                            "message", "Menu item removed successfully",
                            "menu", updated.getMenu()
                    ));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Hotel not found with ID: " + hotelId)));
    }
}
















/*package com.example.Sneha_Kitchen.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.Sneha_Kitchen.model.HotelModel;
import com.example.Sneha_Kitchen.model.HotelMenu;
import com.example.Sneha_Kitchen.repository.HotelRepository;

import java.util.*;

@RestController
@RequestMapping("/api/hotels")
@CrossOrigin(origins = "http://localhost:3000")
public class HotelController {

    @Autowired
    private HotelRepository hotelRepository;

    // ➕ Add new hotel
    @PostMapping
    public ResponseEntity<HotelModel> addHotel(@RequestBody HotelModel hotel) {
        HotelModel savedHotel = hotelRepository.save(hotel);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedHotel);
    }

    // 📜 Get all hotels
    @GetMapping
    public ResponseEntity<List<HotelModel>> getHotels() {
        List<HotelModel> hotels = hotelRepository.findAll();
        return ResponseEntity.ok(hotels);
    }

    // 🔍 Search hotels by name
    @GetMapping("/search")
    public ResponseEntity<List<HotelModel>> searchHotels(@RequestParam String name) {
        List<HotelModel> hotels = hotelRepository.findByHotelNameContainingIgnoreCase(name);
        return ResponseEntity.ok(hotels);
    }

    // 📌 Get single hotel by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getHotelById(@PathVariable String id) {
        return hotelRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Hotel not found with ID: " + id)));
    }

    // ➕ Add menu item to a hotel
    @PostMapping("/{hotelId}/menu")
    public ResponseEntity<?> addMenuItem(
            @PathVariable String hotelId,
            @RequestBody HotelMenu menuItem) {

        return hotelRepository.findById(hotelId)
                .map(hotel -> {
                    if (hotel.getMenu() == null) {
                        hotel.setMenu(new ArrayList<>());
                    }
                    hotel.getMenu().add(menuItem);
                    HotelModel updatedHotel = hotelRepository.save(hotel);

                    Map<String, Object> response = new HashMap<>();
                    response.put("message", "Menu item added successfully to " + updatedHotel.getHotelName());
                    response.put("menu", updatedHotel.getMenu());

                    return ResponseEntity.status(HttpStatus.CREATED).body(response);
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Hotel not found with ID: " + hotelId)));
    }
    
 // DELETE menu item by foodName for a hotel
    @DeleteMapping("/{hotelId}/menu/{foodName}")
    public ResponseEntity<?> deleteMenuItem(
            @PathVariable String hotelId,
            @PathVariable String foodName) {

        return hotelRepository.findById(hotelId).map(hotel -> {
            if (hotel.getMenu() == null || hotel.getMenu().isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "No menu items to remove"));
            }

            // remove items matching foodName (case-sensitive). adjust to use equalsIgnoreCase if you want.
            boolean removed = hotel.getMenu().removeIf(item -> foodName.equals(item.getFoodName()));
            if (!removed) {
                // optionally try case-insensitive match
                removed = hotel.getMenu().removeIf(item -> item.getFoodName() != null &&
                        item.getFoodName().equalsIgnoreCase(foodName));
            }

            if (!removed) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Menu item not found: " + foodName));
            }

            HotelModel updated = hotelRepository.save(hotel);
            return ResponseEntity.ok(Map.of("message", "Menu item removed", "menu", updated.getMenu()));
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Hotel not found with ID: " + hotelId)));
    }
    
    
   
    }

    
    





/*package com.example.Sneha_Kitchen.controller;  this code is withaout delete option ka hai 

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.Sneha_Kitchen.model.HotelModel;
import com.example.Sneha_Kitchen.model.HotelMenu;
import com.example.Sneha_Kitchen.repository.HotelRepository;

import java.util.*;

@RestController
@RequestMapping("/api/hotels")
@CrossOrigin(origins = "http://localhost:3000")
public class HotelController {

    @Autowired
    private HotelRepository hotelRepository;

    // ➕ Add new hotel
    @PostMapping
    public ResponseEntity<HotelModel> addHotel(@RequestBody HotelModel hotel) {
        HotelModel savedHotel = hotelRepository.save(hotel);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedHotel);
    }

    // 📜 Get all hotels
    @GetMapping
    public ResponseEntity<List<HotelModel>> getHotels() {
        List<HotelModel> hotels = hotelRepository.findAll();
        return ResponseEntity.ok(hotels);
    }

    // 🔍 Search hotels by name
    @GetMapping("/search")
    public ResponseEntity<List<HotelModel>> searchHotels(@RequestParam String name) {
        List<HotelModel> hotels = hotelRepository.findByHotelNameContainingIgnoreCase(name);
        return ResponseEntity.ok(hotels);
    }

    // 📌 Get single hotel by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getHotelById(@PathVariable String id) {
        return hotelRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Hotel not found with ID: " + id)));
    }

    // ➕ Add menu item to a hotel
    @PostMapping("/{hotelId}/menu")
    public ResponseEntity<?> addMenuItem(
            @PathVariable String hotelId,
            @RequestBody HotelMenu menuItem) {

        return hotelRepository.findById(hotelId)
                .map(hotel -> {
                    if (hotel.getMenu() == null) {
                        hotel.setMenu(new ArrayList<>());
                    }
                    hotel.getMenu().add(menuItem);
                    HotelModel updatedHotel = hotelRepository.save(hotel);

                    Map<String, Object> response = new HashMap<>();
                    response.put("message", "Menu item added successfully to " + updatedHotel.getHotelName());
                    response.put("menu", updatedHotel.getMenu());

                    return ResponseEntity.status(HttpStatus.CREATED).body(response);
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Hotel not found with ID: " + hotelId)));
    }
}*/
































