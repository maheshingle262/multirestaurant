package com.example.Sneha_Kitchen.repository;

import com.example.Sneha_Kitchen.model.UserModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<UserModel, String> {
    Optional<UserModel> findByEmail(String email);
    Optional<UserModel> findByUsername(String username);
    List<UserModel> findByRole(String role);
 
}






/*package com.example.Sneha_Kitchen.repository;   this code is withaout Add to cart system means users can see not see past orders and adit profile fun

import com.example.Sneha_Kitchen.model.UserModel;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<UserModel, String> {
    UserModel findByUsername(String username);   // 👈 अब यह काम करेगा
    Optional<UserModel> findByEmail(String email);
}*/

