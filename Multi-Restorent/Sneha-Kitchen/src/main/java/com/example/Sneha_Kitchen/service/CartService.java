package com.example.Sneha_Kitchen.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Sneha_Kitchen.model.Cart;
import com.example.Sneha_Kitchen.model.CartItem;
import com.example.Sneha_Kitchen.repository.CartRepository;

@Service
public class CartService {
    @Autowired
    private CartRepository cartRepository;

    public Cart getOrCreateCart(String userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            Cart cart = new Cart();
            cart.setUserId(userId);
            cart.setUpdatedAt(System.currentTimeMillis());
            return cartRepository.save(cart);
        });
    }

    public Cart addItem(String userId, CartItem item) {
        Cart cart = getOrCreateCart(userId);
        boolean found = false;
        for (CartItem ci : cart.getItems()) {
            if (ci.getProductId().equals(item.getProductId())) {
                ci.setQuantity(ci.getQuantity() + item.getQuantity());
                found = true;
                break;
            }
        }
        if (!found) cart.getItems().add(item);
        cart.setUpdatedAt(System.currentTimeMillis());
        return cartRepository.save(cart);
    }

    public Cart updateItemQuantity(String userId, String productId, int qty) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().removeIf(ci -> {
            if (ci.getProductId().equals(productId)) {
                if (qty <= 0) return true;
                ci.setQuantity(qty);
            }
            return false;
        });
        cart.setUpdatedAt(System.currentTimeMillis());
        return cartRepository.save(cart);
    }

    public Cart removeItem(String userId, String productId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().removeIf(ci -> ci.getProductId().equals(productId));
        cart.setUpdatedAt(System.currentTimeMillis());
        return cartRepository.save(cart);
    }

    public void clearCart(String userId) {
        cartRepository.deleteByUserId(userId);
    }
}