package com.example.Sneha_Kitchen.controller;

import com.example.Sneha_Kitchen.model.AllOrder;
import com.example.Sneha_Kitchen.model.UserModel;
import com.example.Sneha_Kitchen.repository.AllOrderRepository;
import com.example.Sneha_Kitchen.repository.UserRepository;
import com.example.Sneha_Kitchen.securityConfig.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/user")

public class UserController {

    @Autowired private UserRepository userRepository;
    @Autowired private AllOrderRepository allOrderRepository;
    @Autowired private JwtUtil jwtUtil;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    // ✅ GET /api/user/profile
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body(Map.of("error", "Missing or invalid Authorization header"));
            }
            String token = authHeader.substring(7);
            String email = jwtUtil.extractUsername(token);
            Optional<UserModel> maybeUser = userRepository.findByEmail(email);
            if (maybeUser.isEmpty()) return ResponseEntity.status(404).body(Map.of("error", "User not found"));

            UserModel u = maybeUser.get();
            Map<String, Object> resp = new HashMap<>();
            resp.put("id", u.getId());
            resp.put("username", u.getUsername());
            resp.put("email", u.getEmail());
            resp.put("role", u.getRole());
            resp.put("address", u.getAddress());
            resp.put("phone", u.getPhone());
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Server error", "details", e.getMessage()));
        }
    }

    // ✅ PUT /api/user/profile (Update user info)
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestHeader(value = "Authorization", required = false) String authHeader,
                                           @RequestBody Map<String, String> body) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body(Map.of("error", "Missing or invalid Authorization header"));
            }
            String token = authHeader.substring(7);
            String email = jwtUtil.extractUsername(token);

            Optional<UserModel> maybeUser = userRepository.findByEmail(email);
            if (maybeUser.isEmpty()) return ResponseEntity.status(404).body(Map.of("error", "User not found"));

            UserModel u = maybeUser.get();

            // update fields
            if (body.containsKey("username")) u.setUsername(body.get("username"));
            if (body.containsKey("address")) u.setAddress(body.get("address"));
            if (body.containsKey("phone")) u.setPhone(body.get("phone"));

            // update password
            if (body.containsKey("password") && body.get("password") != null && !body.get("password").isEmpty()) {
                u.setPassword(encoder.encode(body.get("password")));
            }

            // update email
            boolean emailChanged = false;
            if (body.containsKey("email") && body.get("email") != null && !body.get("email").isEmpty()) {
                String newEmail = body.get("email");
                if (!newEmail.equalsIgnoreCase(u.getEmail())) {
                    if (userRepository.findByEmail(newEmail).isPresent()) {
                        return ResponseEntity.status(400).body(Map.of("error", "Email already in use"));
                    }
                    u.setEmail(newEmail.toLowerCase());
                    emailChanged = true;
                }
            }

            userRepository.save(u);

            Map<String, Object> resp = new HashMap<>();
            resp.put("id", u.getId());
            resp.put("username", u.getUsername());
            resp.put("email", u.getEmail());
            resp.put("role", u.getRole());
            resp.put("address", u.getAddress());
            resp.put("phone", u.getPhone());

            if (emailChanged) {
                String newToken = jwtUtil.generateToken(u.getEmail(), u.getRole());
                resp.put("token", newToken);
            }

            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Server error", "details", e.getMessage()));
        }
    }

    // ✅ GET /api/user/orders
    @GetMapping("/orders")
    public ResponseEntity<?> getUserOrders(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body(Map.of("error", "Missing or invalid Authorization header"));
            }
            String token = authHeader.substring(7);
            String email = jwtUtil.extractUsername(token);
            Optional<UserModel> maybeUser = userRepository.findByEmail(email);
            if (maybeUser.isEmpty()) return ResponseEntity.status(404).body(Map.of("error", "User not found"));

            UserModel u = maybeUser.get();

            // by email
            List<AllOrder> ordersByEmail = allOrderRepository.findByCustomerEmail(u.getEmail());
            if (ordersByEmail != null && !ordersByEmail.isEmpty()) {
                return ResponseEntity.ok(ordersByEmail);
            }

            // fallback: by username
            List<AllOrder> ordersByName = allOrderRepository.findByCustomerName(u.getUsername());
            return ResponseEntity.ok(ordersByName == null ? Collections.emptyList() : ordersByName);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Server error", "details", e.getMessage()));
        }
    }
}








/*package com.example.Sneha_Kitchen.controller;

import com.example.Sneha_Kitchen.model.AllOrder;
import com.example.Sneha_Kitchen.model.UserModel;
import com.example.Sneha_Kitchen.repository.AllOrderRepository;
import com.example.Sneha_Kitchen.repository.UserRepository;
import com.example.Sneha_Kitchen.securityConfig.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired private UserRepository userRepository;
    @Autowired private AllOrderRepository allOrderRepository;
    @Autowired private JwtUtil jwtUtil;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    // GET /api/user/profile
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body(Map.of("error", "Missing or invalid Authorization header"));
            }
            String token = authHeader.substring(7);
            String email = jwtUtil.extractUsername(token);
            Optional<UserModel> maybeUser = userRepository.findByEmail(email);
            if (maybeUser.isEmpty()) return ResponseEntity.status(404).body(Map.of("error", "User not found"));

            UserModel u = maybeUser.get();
            Map<String, Object> resp = new HashMap<>();
            resp.put("id", u.getId());
            resp.put("username", u.getUsername());
            resp.put("email", u.getEmail());
            resp.put("role", u.getRole());
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Server error", "details", e.getMessage()));
        }
    }

    // PUT /api/user/profile  -> update username and/or password (and email if you want)
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestHeader(value = "Authorization", required = false) String authHeader,
                                           @RequestBody Map<String, String> body) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body(Map.of("error", "Missing or invalid Authorization header"));
            }
            String token = authHeader.substring(7);
            String email = jwtUtil.extractUsername(token);

            Optional<UserModel> maybeUser = userRepository.findByEmail(email);
            if (maybeUser.isEmpty()) return ResponseEntity.status(404).body(Map.of("error", "User not found"));

            UserModel u = maybeUser.get();

            // update username
            if (body.containsKey("username")) {
                u.setUsername(body.get("username"));
            }
            // update password
            if (body.containsKey("password") && body.get("password") != null && !body.get("password").isEmpty()) {
                u.setPassword(encoder.encode(body.get("password")));
            }
            // update email (optional) — if email changed, we should issue a new token
            boolean emailChanged = false;
            if (body.containsKey("email") && body.get("email") != null && !body.get("email").isEmpty()) {
                String newEmail = body.get("email");
                if (!newEmail.equalsIgnoreCase(u.getEmail())) {
                    // check duplicate
                    if (userRepository.findByEmail(newEmail).isPresent()) {
                        return ResponseEntity.status(400).body(Map.of("error", "Email already in use"));
                    }
                    u.setEmail(newEmail.toLowerCase());
                    emailChanged = true;
                }
            }

            userRepository.save(u);

            Map<String, Object> resp = new HashMap<>();
            resp.put("id", u.getId());
            resp.put("username", u.getUsername());
            resp.put("email", u.getEmail());
            resp.put("role", u.getRole());

            // if email changed, return a new token so client can update Authorization header
            if (emailChanged) {
                String newToken = jwtUtil.generateToken(u.getEmail(), u.getRole());
                resp.put("token", newToken);
            }

            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Server error", "details", e.getMessage()));
        }
    }

    // Backwards-compatible endpoint for user orders (uses username->customerName if email was not recorded)
    @GetMapping("/orders")
    public ResponseEntity<?> getUserOrders(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body(Map.of("error", "Missing or invalid Authorization header"));
            }
            String token = authHeader.substring(7);
            String email = jwtUtil.extractUsername(token);
            Optional<UserModel> maybeUser = userRepository.findByEmail(email);
            if (maybeUser.isEmpty()) return ResponseEntity.status(404).body(Map.of("error", "User not found"));

            UserModel u = maybeUser.get();
            // try email first (if orders saved with customerEmail)
            List<AllOrder> ordersByEmail = allOrderRepository.findByCustomerEmail(u.getEmail());
            if (ordersByEmail != null && !ordersByEmail.isEmpty()) {
                return ResponseEntity.ok(ordersByEmail);
            }
            // fallback: match by customerName
            List<AllOrder> ordersByName = allOrderRepository.findByCustomerName(u.getUsername());
            return ResponseEntity.ok(ordersByName == null ? Collections.emptyList() : ordersByName);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Server error", "details", e.getMessage()));
        }
    }  
}*/























/*package com.example.Sneha_Kitchen.controller; this code is withaout Add to cart system means users can see not see past orders and adit profile fun

import com.example.Sneha_Kitchen.model.AllOrder;
import com.example.Sneha_Kitchen.model.UserModel;
import com.example.Sneha_Kitchen.repository.AllOrderRepository;
import com.example.Sneha_Kitchen.repository.UserRepository;
import com.example.Sneha_Kitchen.securityConfig.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

// User-specific endpoints (profile & orders)
@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000") // adjust if your front-end origin differs
public class UserController {

    @Autowired private UserRepository userRepository;
    @Autowired private AllOrderRepository allOrderRepository;
    @Autowired private JwtUtil jwtUtil;

    // GET /api/user/profile
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Missing or invalid Authorization header"));
            }
            String token = authHeader.substring(7);
            String email = jwtUtil.extractUsername(token);
            Optional<UserModel> maybeUser = userRepository.findByEmail(email);
            if (maybeUser.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
            }

            UserModel u = maybeUser.get();
            // Return safe object (do not return password)
            Map<String, Object> resp = new HashMap<>();
            resp.put("id", u.getId());
            resp.put("username", u.getUsername());
            resp.put("email", u.getEmail());
            resp.put("role", u.getRole());
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Server error", "details", e.getMessage()));
        }
    }

    // GET /api/user/orders
    @GetMapping("/orders")
    public ResponseEntity<?> getUserOrders(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Missing or invalid Authorization header"));
            }
            String token = authHeader.substring(7);
            String email = jwtUtil.extractUsername(token);

            List<AllOrder> orders = allOrderRepository.findByCustomerEmail(email);
            if (orders == null) orders = Collections.emptyList();

            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Server error", "details", e.getMessage()));
        }
    }
}*/
