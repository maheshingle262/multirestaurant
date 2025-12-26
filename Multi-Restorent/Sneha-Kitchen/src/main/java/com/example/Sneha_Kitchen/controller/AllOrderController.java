package com.example.Sneha_Kitchen.controller;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import com.example.Sneha_Kitchen.dto.OrderResponse;
import com.example.Sneha_Kitchen.model.AllOrder;
import com.example.Sneha_Kitchen.model.UserModel;
import com.example.Sneha_Kitchen.repository.AllOrderRepository;
import com.example.Sneha_Kitchen.repository.UserRepository;
import com.example.Sneha_Kitchen.securityConfig.JwtUtil;
import com.example.Sneha_Kitchen.service.SmsService;

@RestController
@RequestMapping("/orders")

public class AllOrderController {

    @Autowired private AllOrderRepository allOrderRepository;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private UserRepository userRepository;
    @Autowired private SmsService smsService;

    
    // ============================================================================================
    //  SAVE ORDER (Used by Customer Checkout)
    // ============================================================================================

    @PostMapping("/save")
    public AllOrder saveOrder(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody AllOrder order) {

        order.setOrderDateTime(LocalDateTime.now());
        order.setStatus(order.getStatus() == null || order.getStatus().isEmpty() ? "Pending" : order.getStatus());

        // ----- Extract Logged-in User From JWT -----
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                String token = authHeader.substring(7);
                String email = jwtUtil.extractUsername(token);

                order.setCustomerEmail(email);

                userRepository.findByEmail(email).ifPresent(user -> {
                    order.setCustomerName(user.getUsername());
                    order.setCustomerAddress(user.getAddress());
                    order.setCustomerPhone(user.getPhone());
                });

            } catch (Exception e) {
                System.out.println("JWT Parse Error: " + e.getMessage());
            }
        }

        // ---- Save Order ----
        AllOrder saved = allOrderRepository.save(order);

        // ---- Send SMS Confirmation ----
        if (saved.getCustomerPhone() != null) {
            String smsMsg =
                    "Hi " + saved.getCustomerName() +
                    ", your order for " + saved.getFoodName() +
                    " has been placed successfully! Status: Pending.";

            smsService.sendSms(saved.getCustomerPhone(), smsMsg);
        }

        return saved;
    }


    // ============================================================================================
    //  UPDATE ORDER STATUS (Admin Panel)
    // ============================================================================================

    @PutMapping("/update-status/{id}")
    public AllOrder updateOrderStatus(@PathVariable @NonNull String id, @RequestParam String status) {

        AllOrder order = allOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(status);
        AllOrder updated = allOrderRepository.save(order);

        // ---- Send SMS for Status Update ----
        if (order.getCustomerPhone() != null) {
            String sms =
                    "Hi " + order.getCustomerName() +
                    ", your order status is now '" + status +
                    "'. Thank you for ordering from " + order.getHotelName() + "!";

            smsService.sendSms(order.getCustomerPhone(), sms);
        }

        return updated;
    }


    // ============================================================================================
    //  GET ORDERS BY HOTEL (Hotel Admin Panel)
    // ============================================================================================

    @GetMapping("/hotel/{hotelName}")
    public List<AllOrder> getOrdersByHotel(@PathVariable String hotelName) {
        return allOrderRepository.findByHotelName(hotelName);
    }


    // ============================================================================================
    //  GET ALL ORDERS (Super Admin)
    // ============================================================================================

    @GetMapping("/all")
    public List<OrderResponse> getAllOrders() {

        return allOrderRepository.findAll().stream().map(order -> {

            OrderResponse dto = new OrderResponse();
            dto.setOrderId(order.getId());
            dto.setCustomerName(order.getCustomerName());
            dto.setCustomerEmail(order.getCustomerEmail());
            dto.setHotelName(order.getHotelName());
            dto.setOrderDate(order.getOrderDateTime());
            dto.setStatus(order.getStatus());

            // Handle multiple items OR single item
            if (order.getId() != null && !order.getId().isEmpty()) {
                dto.setItems(order.getId());  
            } else {
                String food = order.getFoodName() != null ? order.getFoodName() : "Item";
                int qty = order.getQuantity() > 0 ? order.getQuantity() : 1;
                dto.setItems(Collections.singletonList(food + " x " + qty));
            }

            int qty = order.getQuantity() > 0 ? order.getQuantity() : 1;
            dto.setTotalPrice(order.getPrice() * qty);

            return dto;

        }).collect(Collectors.toList());
    }


    // ============================================================================================
    //  GET CUSTOMERS OWN ORDERS (My Orders Page)
    // ============================================================================================

    @GetMapping("/my-orders")
    public List<AllOrder> getMyOrders(@RequestHeader("Authorization") String authHeader) {

        if (!authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or Invalid Authorization Header");
        }

        String token = authHeader.substring(7);
        String email = jwtUtil.extractUsername(token);

        return allOrderRepository.findByCustomerEmail(email);
    }


    // ============================================================================================
    //  CUSTOMER DASHBOARD (Profile + Orders)
    // ============================================================================================

    @GetMapping("/my-dashboard")
    public Map<String, Object> getDashboard(@RequestHeader("Authorization") String authHeader) {

        if (!authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid Authorization Token");
        }

        String token = authHeader.substring(7);
        String email = jwtUtil.extractUsername(token);

        Map<String, Object> response = new HashMap<>();

        Optional<UserModel> user = userRepository.findByEmail(email);

        response.put("profile", user.orElse(null));
        response.put("orders", allOrderRepository.findByCustomerEmail(email));

        return response;
    }
}


































































/*package com.example.Sneha_Kitchen.controller;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.Sneha_Kitchen.dto.OrderResponse;
import com.example.Sneha_Kitchen.model.AllOrder;
import com.example.Sneha_Kitchen.model.UserModel;
import com.example.Sneha_Kitchen.repository.AllOrderRepository;
import com.example.Sneha_Kitchen.repository.UserRepository;
import com.example.Sneha_Kitchen.securityConfig.JwtUtil;
import com.example.Sneha_Kitchen.service.SmsService;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class AllOrderController {

    @Autowired private AllOrderRepository allOrderRepository;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private UserRepository userRepository;
    @Autowired private SmsService smsService;

    // SAVE ORDER
    @PostMapping("/save")
    public AllOrder saveOrder(@RequestHeader(value = "Authorization", required = false) String authHeader,
                              @RequestBody AllOrder order) {

        order.setOrderDateTime(LocalDateTime.now());
        if (order.getStatus() == null || order.getStatus().isEmpty()) {
            order.setStatus("Pending");
        }

        // Read User from JWT
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                String token = authHeader.substring(7);
                String email = jwtUtil.extractUsername(token);

                order.setCustomerEmail(email);

                userRepository.findByEmail(email).ifPresent(user -> {
                    order.setCustomerName(user.getUsername());
                    order.setCustomerAddress(user.getAddress());
                    order.setCustomerPhone(user.getPhone());
                });

            } catch (Exception e) {
                System.out.println("JWT Error: " + e.getMessage());
            }
        }

        AllOrder savedOrder = allOrderRepository.save(order);

        // SEND SMS – Order Placed
        if (savedOrder.getCustomerPhone() != null) {
            String msg = "Hi " + savedOrder.getCustomerName() +
                    ", your order for " + savedOrder.getFoodName() +
                    " is placed successfully! Status: Pending.";
            smsService.sendSms(savedOrder.getCustomerPhone(), msg);
        }

        return savedOrder;
    }

    // UPDATE STATUS
    @PutMapping("/update-status/{id}")
    public AllOrder updateOrderStatus(@PathVariable String id, @RequestParam String status) {

        AllOrder order = allOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(status);
        AllOrder updatedOrder = allOrderRepository.save(order);

        // SEND SMS – Status Update
        if (order.getCustomerPhone() != null) {
            String msg = "Hi " + order.getCustomerName()
                    + ", your order status is now '" + status 
                    + "'. Thank you for ordering from " + order.getHotelName() + "!";
            smsService.sendSms(order.getCustomerPhone(), msg);
        }

        return updatedOrder;
    }

    // ------- Remaining Endpoints Unchanged -------


	
	
    // ------------------------ GET ORDERS BY HOTEL ----------------------------------

    @GetMapping("/hotel/{hotelName}")
    public List<AllOrder> getOrdersByHotel(@PathVariable String hotelName) {
        return allOrderRepository.findByHotelName(hotelName);
    }

    // --------------------------- ALL ORDERS FOR ADMIN -----------------------------

    @GetMapping("/all")
    public List<OrderResponse> getAllOrders() {
        return allOrderRepository.findAll().stream().map(order -> {
            OrderResponse dto = new OrderResponse();

            dto.setOrderId(order.getId());
            dto.setCustomerName(order.getCustomerName());
            dto.setCustomerEmail(order.getCustomerEmail());
            dto.setHotelName(order.getHotelName());

            String food = order.getFoodName() != null ? order.getFoodName() : "Item";
            int qty = order.getQuantity() > 0 ? order.getQuantity() : 1;

            dto.setItems(Collections.singletonList(food + " x " + qty));
            dto.setTotalPrice(order.getPrice() * qty);
            dto.setOrderDate(order.getOrderDateTime());
            dto.setStatus(order.getStatus());

            return dto;
        }).collect(Collectors.toList());
    }

    // ----------------------------- MY ORDERS --------------------------------------

    @GetMapping("/my-orders")
    public List<AllOrder> getMyOrders(@RequestHeader(value = "Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);
        String email = jwtUtil.extractUsername(token);

        return allOrderRepository.findByCustomerEmail(email);
    }

    // -------------------- DASHBOARD (Profile + Orders) ----------------------------

    @GetMapping("/my-dashboard")
    public Map<String, Object> getMyDashboard(@RequestHeader(value = "Authorization") String authHeader) {

        if (!authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid Authorization header");
        }

        String token = authHeader.substring(7);
        String email = jwtUtil.extractUsername(token);

        Map<String, Object> response = new HashMap<>();

        Optional<UserModel> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            response.put("profile", userOpt.get());
            response.put("orders", allOrderRepository.findByCustomerEmail(email));
        } else {
            response.put("profile", "User not found");
            response.put("orders", Collections.emptyList());
        }

        return response;
    }
}*/





































