
package com.example.Sneha_Kitchen.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Sneha_Kitchen.model.Cart;
import com.example.Sneha_Kitchen.model.CartItem;
import com.example.Sneha_Kitchen.service.CartService;

@RestController
@RequestMapping("/cart")
public class CartController {
    @Autowired
    private CartService cartService;

    // Helper: extract userId from auth header or use provided param (fallback for guest)
    private String getUserIdFromHeaderOrParam(String userIdHeader, @RequestParam(value="userId", required=false) String userIdParam) {
        if (userIdHeader != null && !userIdHeader.isEmpty()) return userIdHeader;
        return userIdParam != null ? userIdParam : "guest";
    }

    @GetMapping
    public Cart getCart(@RequestHeader(value = "X-User-Id", required = false) String uidHeader,
                        @RequestParam(value="userId", required=false) String userIdParam) {
        String userId = getUserIdFromHeaderOrParam(uidHeader, userIdParam);
        return cartService.getOrCreateCart(userId);
    }

    @PostMapping("/add")
    public Cart addToCart(@RequestHeader(value = "X-User-Id", required = false) String uidHeader,
                          @RequestParam(value="userId", required=false) String userIdParam,
                          @RequestBody CartItem item) {
        String userId = getUserIdFromHeaderOrParam(uidHeader, userIdParam);
        return cartService.addItem(userId, item);
    }

    @PutMapping("/update/{productId}")
    public Cart updateQty(@RequestHeader(value = "X-User-Id", required = false) String uidHeader,
                          @RequestParam(value="userId", required=false) String userIdParam,
                          @PathVariable String productId,
                          @RequestParam int qty) {
        String userId = getUserIdFromHeaderOrParam(uidHeader, userIdParam);
        return cartService.updateItemQuantity(userId, productId, qty);
    }

    @DeleteMapping("/remove/{productId}")
    public Cart removeItem(@RequestHeader(value = "X-User-Id", required = false) String uidHeader,
                           @RequestParam(value="userId", required=false) String userIdParam,
                           @PathVariable String productId) {
        String userId = getUserIdFromHeaderOrParam(uidHeader, userIdParam);
        return cartService.removeItem(userId, productId);
    }

    @PostMapping("/clear")
    public void clearCart(@RequestHeader(value = "X-User-Id", required = false) String uidHeader,
                          @RequestParam(value="userId", required=false) String userIdParam) {
        String userId = getUserIdFromHeaderOrParam(uidHeader, userIdParam);
        cartService.clearCart(userId);
    }

    // Checkout endpoint (high level)
    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestHeader(value = "X-User-Id", required = false) String uidHeader,
                                      @RequestParam(value="userId", required=false) String userIdParam,
                                      @RequestBody Map<String,Object> body) {
        String userId = getUserIdFromHeaderOrParam(uidHeader, userIdParam);
        Cart cart = cartService.getOrCreateCart(userId);

        if (cart.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body("Cart is empty");
        }

        // Convert cart to order using your existing Order service.
        // Example pseudo:
        // Order order = orderService.createOrderFromCart(userId, cart, otherDetailsFromBody);
        // cartService.clearCart(userId);
        // return ResponseEntity.ok(order);

        // For now respond with cart summary (replace with real order creation)
        Map<String, Object> resp = new HashMap<>();
        resp.put("cart", cart);
        resp.put("message", "Implement order creation in controller (map to your existing Order model).");
        return ResponseEntity.ok(resp);
    }
}
