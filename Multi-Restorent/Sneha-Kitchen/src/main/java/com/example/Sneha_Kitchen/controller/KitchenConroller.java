package com.example.Sneha_Kitchen.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Sneha_Kitchen.model.KitchenModel;
import com.example.Sneha_Kitchen.repository.KitchenRepository;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/order")

public class KitchenConroller {

    @Autowired
    private KitchenRepository orderRepo;

    // ✅ Place new order
    @PostMapping
    public ResponseEntity<KitchenModel> placeOrder(@RequestBody KitchenModel order) {
        // Set default status if not provided
        if (order.getStatus() == null || order.getStatus().isEmpty()) {
            order.setStatus("Preparing");
        }

        // ✅ Set date (yyyy-MM-dd)
        String today = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        order.setDate(today);

        // ✅ Set current time in hh:mm a format (e.g., 01:30 PM)
        String currentTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("hh:mm a"));
        order.setTime(currentTime);

        KitchenModel savedOrder = orderRepo.save(order);
        return new ResponseEntity<>(savedOrder, HttpStatus.CREATED);
    }

    // ✅ Get all orders
    @GetMapping
    public ResponseEntity<List<KitchenModel>> getAllOrders() {
        return new ResponseEntity<>(orderRepo.findAll(), HttpStatus.OK);
    }

    // ✅ Get orders by specific date
    @GetMapping("/byDate")
    public ResponseEntity<List<KitchenModel>> getOrdersByDate(@RequestParam String date) {
        List<KitchenModel> ordersByDate = orderRepo.findByDate(date);
        return new ResponseEntity<>(ordersByDate, HttpStatus.OK);
    }

    // ✅ Update order status
    @PutMapping("/{id}/status")
    public ResponseEntity<KitchenModel> updateOrderStatus(
            @PathVariable String id,
            @RequestParam String status) {

        KitchenModel order = orderRepo.findById(id).orElse(null);

        if (order == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        order.setStatus(status);
        KitchenModel updatedOrder = orderRepo.save(order);
        return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
    }
}































    

	

