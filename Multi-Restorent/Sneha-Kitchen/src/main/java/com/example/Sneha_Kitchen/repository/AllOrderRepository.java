package com.example.Sneha_Kitchen.repository;

import com.example.Sneha_Kitchen.model.AllOrder;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AllOrderRepository extends MongoRepository<AllOrder, String> {
    List<AllOrder> findByHotelName(String hotelName);
    List<AllOrder> findByCustomerEmail(String customerEmail);
    List<AllOrder> findByCustomerName(String customerName);
    
    
}













/*package com.example.Sneha_Kitchen.repository;  this code is withaout Add to cart system means users can see not see past orders and adit profile fun

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.Sneha_Kitchen.model.AllOrder;

public interface AllOrderRepository extends MongoRepository<AllOrder, String> {
    List<AllOrder> findByHotelName(String hotelName);
    List<AllOrder> findByCustomerEmail(String customerEmail);
}*/

