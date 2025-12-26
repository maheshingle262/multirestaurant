package com.example.Sneha_Kitchen.repository;


import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.Sneha_Kitchen.model.Cart;

import java.util.Optional;

public interface CartRepository extends MongoRepository<Cart, String> {
    Optional<Cart> findByUserId(String userId);
    void deleteByUserId(String userId);
}