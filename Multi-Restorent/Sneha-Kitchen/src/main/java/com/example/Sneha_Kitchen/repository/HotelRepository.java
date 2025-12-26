package com.example.Sneha_Kitchen.repository;

import com.example.Sneha_Kitchen.model.HotelModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface HotelRepository extends MongoRepository<HotelModel, String> {
    List<HotelModel> findByHotelNameContainingIgnoreCase(String name);
}
