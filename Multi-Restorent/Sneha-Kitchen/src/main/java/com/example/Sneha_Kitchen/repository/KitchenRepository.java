package com.example.Sneha_Kitchen.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.Sneha_Kitchen.model.KitchenModel;

public interface KitchenRepository extends MongoRepository<KitchenModel, String> {
	
	List<KitchenModel> findByStatus(String status);

	List<KitchenModel> findByDate(String date);

}
