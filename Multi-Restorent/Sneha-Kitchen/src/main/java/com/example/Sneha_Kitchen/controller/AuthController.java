package com.example.Sneha_Kitchen.controller;

import com.example.Sneha_Kitchen.model.UserModel;
import com.example.Sneha_Kitchen.model.AllOrder;
import com.example.Sneha_Kitchen.repository.UserRepository;
import com.example.Sneha_Kitchen.repository.AllOrderRepository;
import com.example.Sneha_Kitchen.securityConfig.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/auth")

public class AuthController {

    @Autowired private UserRepository userRepository;
    @Autowired private AllOrderRepository allOrderRepository;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private PasswordEncoder encoder;

    // Bootstrap secrets (dev only) - set in application.properties
    @Value("${app.admin.secret:}")
    private String adminCreationSecret;

    @Value("${app.shopkeeper.secret:}")
    private String shopkeeperCreationSecret;

    // ---------- Register (user) ----------
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserModel user) {
        try {
            // lowercase email and ensure unique
            String email = user.getEmail() == null ? "" : user.getEmail().toLowerCase();
            if (email.isEmpty()) return ResponseEntity.badRequest().body(Map.of("message","Email required"));
            if (userRepository.findByEmail(email).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message","Email already registered"));
            }

            user.setEmail(email);
            user.setRole("USER");
            user.setPassword(encoder.encode(user.getPassword()));
            userRepository.save(user);

            String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
            Map<String, Object> resp = new HashMap<>();
            resp.put("message","User registered successfully");
            resp.put("token", token);
            resp.put("name", user.getUsername());
            resp.put("role", user.getRole());
            resp.put("email", user.getEmail());
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message","Register failed", "error", e.getMessage()));
        }
    }

    // ---------- Login ----------
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserModel payload) {
        try {
            String email = payload.getEmail() == null ? "" : payload.getEmail().toLowerCase();
            UserModel found = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (!encoder.matches(payload.getPassword(), found.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message","Invalid password"));
            }

            String token = jwtUtil.generateToken(found.getEmail(), found.getRole());
            Map<String, Object> resp = new HashMap<>();
            resp.put("message","Login successful");
            resp.put("token", token);
            resp.put("name", found.getUsername());
            resp.put("role", found.getRole());
            resp.put("email", found.getEmail());
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message","Login failed", "error", e.getMessage()));
        }
    }

    // ---------- Admin bootstrap (dev only) ----------
    @PostMapping("/register-admin-bootstrap")
    public ResponseEntity<?> registerAdminBootstrap(@RequestHeader(value = "X-Admin-Secret", required = false) String secret,
                                                    @RequestBody UserModel user) {
        try {
            if (adminCreationSecret == null || adminCreationSecret.isEmpty()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message","Admin bootstrap disabled"));
            }
            if (secret == null || !adminCreationSecret.equals(secret)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message","Invalid admin secret"));
            }
            if (userRepository.findByEmail(user.getEmail().toLowerCase()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message","Email already exists"));
            }

            user.setEmail(user.getEmail().toLowerCase());
            user.setPassword(encoder.encode(user.getPassword()));
            user.setRole("ADMIN");
            userRepository.save(user);

            String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
            return ResponseEntity.ok(Map.of("message","Admin created","token",token,"name",user.getUsername(),"role",user.getRole()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message","Failed to create admin","error",e.getMessage()));
        }
    }

    // ---------- Shopkeeper bootstrap (dev only) ----------
    @PostMapping("/register-shopkeeper-bootstrap")
    public ResponseEntity<?> registerShopkeeperBootstrap(@RequestHeader(value = "X-Shopkeeper-Secret", required = false) String secret,
                                                         @RequestBody UserModel user) {
        try {
            if (shopkeeperCreationSecret == null || shopkeeperCreationSecret.isEmpty()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message","Shopkeeper bootstrap disabled"));
            }
            if (secret == null || !shopkeeperCreationSecret.equals(secret)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message","Invalid shopkeeper secret"));
            }
            if (userRepository.findByEmail(user.getEmail().toLowerCase()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message","Email already exists"));
            }

            user.setEmail(user.getEmail().toLowerCase());
            user.setPassword(encoder.encode(user.getPassword()));
            user.setRole("SHOPKEEPER");
            userRepository.save(user);

            String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
            return ResponseEntity.ok(Map.of("message","Shopkeeper created","token",token,"name",user.getUsername(),"role",user.getRole()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message","Failed to create shopkeeper","error",e.getMessage()));
        }
    }

    // ---------- Profile (unified safe) ----------
    @GetMapping("/profile")
    public ResponseEntity<?> profile(@RequestHeader(value = "Authorization", required = false) String header) {
        try {
            if (header==null || !header.startsWith("Bearer ")) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message","Missing token"));
            String token = header.substring(7);
            String email = jwtUtil.extractUsername(token);
            UserModel user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

            Map<String,Object> resp = new HashMap<>();
            resp.put("id", user.getId());
            resp.put("username", user.getUsername());
            resp.put("email", user.getEmail());
            resp.put("role", user.getRole());
            // optional fields (address, phone) if you added them
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message","Profile error","error",e.getMessage()));
        }
    }

    // ---------- User orders (example) ----------
    @GetMapping("/orders")
    public ResponseEntity<?> orders(@RequestHeader(value = "Authorization", required = false) String header) {
        try {
            if (header==null || !header.startsWith("Bearer ")) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message","Missing token"));
            String token = header.substring(7);
            String email = jwtUtil.extractUsername(token);
            List<AllOrder> orders = allOrderRepository.findByCustomerEmail(email);
            return ResponseEntity.ok(orders == null ? Collections.emptyList() : orders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message","Orders error","error",e.getMessage()));
        }
    }
}










/*// src/main/java/com/example/Sneha_Kitchen/controller/AuthController.java
package com.example.Sneha_Kitchen.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.example.Sneha_Kitchen.model.AllOrder;
import com.example.Sneha_Kitchen.model.UserModel;
import com.example.Sneha_Kitchen.repository.AllOrderRepository;
import com.example.Sneha_Kitchen.repository.UserRepository;
import com.example.Sneha_Kitchen.securityConfig.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AllOrderRepository allOrderRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    // admin bootstrap secret (set in application.properties or env)
    @Value("${app.admin.secret:}")
    private String adminCreationSecret;

    // ---------- Register (regular user) ----------
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserModel user) {
        try {
            user.setRole("USER"); // force USER on registration
            user.setPassword(encoder.encode(user.getPassword()));
            userRepository.save(user);

            String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
            Map<String, String> resp = new HashMap<>();
            resp.put("message", "User registered successfully");
            resp.put("token", token);
            resp.put("name", user.getUsername());
            resp.put("role", user.getRole());
            resp.put("email", user.getEmail());
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Register failed: " + e.getMessage());
        }
    }

    // ---------- Login ----------//
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserModel user) {
        try {
            UserModel foundUser = userRepository.findByEmail(user.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (!encoder.matches(user.getPassword(), foundUser.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
            }

            String token = jwtUtil.generateToken(foundUser.getEmail(), foundUser.getRole());
            Map<String, String> resp = new HashMap<>();
            resp.put("message", "Login successful");
            resp.put("token", token);
            resp.put("name", foundUser.getUsername());
            resp.put("role", foundUser.getRole());
            resp.put("email", foundUser.getEmail());
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login failed: " + e.getMessage());
        }
    }

    // ---------- Admin create (protected; only admins can create admins) ----------
    @PostMapping("/register-admin")
    public ResponseEntity<?> registerAdmin(@RequestHeader("Authorization") String authHeader,
                                           @RequestBody UserModel user) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
            }
            String callerToken = authHeader.substring(7);
            String callerRole = jwtUtil.extractRole(callerToken);
            if (!"ADMIN".equalsIgnoreCase(callerRole)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only admins can create admins");
            }

            user.setPassword(encoder.encode(user.getPassword()));
            user.setRole("ADMIN");
            userRepository.save(user);

            String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
            Map<String, String> resp = new HashMap<>();
            resp.put("message", "Admin created");
            resp.put("token", token);
            resp.put("name", user.getUsername());
            resp.put("role", user.getRole());
            resp.put("email", user.getEmail());
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create admin: " + e.getMessage());
        }
    }

    // ---------- Admin create (bootstrap) ----------
    // This endpoint allows creating an ADMIN by providing the server-side secret.
    // USE FOR DEV / ONE-TIME BOOTSTRAP ONLY. Do not expose admin secret in public build.
    @PostMapping("/register-admin-bootstrap")
    public ResponseEntity<?> registerAdminBootstrap(@RequestHeader(value = "X-Admin-Secret", required = false) String secret,
                                                   @RequestBody UserModel user) {
        try {
            if (adminCreationSecret == null || adminCreationSecret.isEmpty()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Admin bootstrap is disabled on server");
            }
            if (secret == null || !adminCreationSecret.equals(secret)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid admin secret");
            }

            user.setPassword(encoder.encode(user.getPassword()));
            user.setRole("ADMIN");
            userRepository.save(user);

            String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
            Map<String, String> resp = new HashMap<>();
            resp.put("message", "Admin created by bootstrap");
            resp.put("token", token);
            resp.put("name", user.getUsername());
            resp.put("role", user.getRole());
            resp.put("email", user.getEmail());
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create admin: " + e.getMessage());
        }
    }

    // ---------- Profile ----------
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String tokenHeader) {
        try {
            if (tokenHeader == null || !tokenHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Token");
            }
            String token = tokenHeader.substring(7);
            String email = jwtUtil.extractUsername(token);
            Optional<UserModel> user = userRepository.findByEmail(email);
            return user.map(ResponseEntity::ok)
                       .orElseThrow();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    // ---------- User orders ----------
    @GetMapping("/orders")
    public ResponseEntity<?> getUserOrders(@RequestHeader("Authorization") String tokenHeader) {
        try {
            if (tokenHeader == null || !tokenHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Token");
            }
            String token = tokenHeader.substring(7);
            String email = jwtUtil.extractUsername(token);

            List<AllOrder> orders = allOrderRepository.findByCustomerEmail(email);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }
}















/*package com.example.Sneha_Kitchen.controller; this code is withaout Add to cart system means users can see not see past orders and adit profile fun

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Sneha_Kitchen.model.AllOrder;
import com.example.Sneha_Kitchen.model.UserModel;
import com.example.Sneha_Kitchen.repository.AllOrderRepository;
import com.example.Sneha_Kitchen.repository.UserRepository;
import com.example.Sneha_Kitchen.securityConfig.JwtUtil;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AllOrderRepository allOrderRepository; // sabhi orders ka repo

    @Autowired
    private JwtUtil jwtUtil;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    // ✅ Register
    @PostMapping("/register")
    public Map<String, String> register(@RequestBody UserModel user) {
        user.setPassword(encoder.encode(user.getPassword()));
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail());
        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered successfully");
        response.put("token", token);
        response.put("name", user.getUsername());
        response.put("email", user.getEmail());
        return response;
    }

    // ✅ Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserModel user) {
        try {
            UserModel foundUser = userRepository.findByEmail(user.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (!encoder.matches(user.getPassword(), foundUser.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
            }

            String token = jwtUtil.generateToken(foundUser.getEmail());
            Map<String, String> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("token", token);
            response.put("name", foundUser.getUsername());
            response.put("email", foundUser.getEmail());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login failed: " + e.getMessage());
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String token) {
        try {
            if (token == null || !token.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid token format");
            }

            String email = jwtUtil.extractUsername(token.substring(7));
            Optional<UserModel> user = userRepository.findByEmail(email);

            if (user.isPresent()) {
                return ResponseEntity.ok(user.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/orders")
    public ResponseEntity<?> getUserOrders(@RequestHeader("Authorization") String token) {
        try {
            if (token == null || !token.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid token format");
            }

            String email = jwtUtil.extractUsername(token.substring(7));
            List<AllOrder> orders = allOrderRepository.findByCustomerEmail(email);

            if (orders.isEmpty()) {
                return ResponseEntity.ok("No orders found for this user");
            } else {
                return ResponseEntity.ok(orders);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }
}*/


