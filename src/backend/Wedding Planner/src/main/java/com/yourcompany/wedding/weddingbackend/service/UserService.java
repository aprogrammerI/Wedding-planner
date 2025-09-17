package com.yourcompany.wedding.weddingbackend.service;

import com.yourcompany.wedding.weddingbackend.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    List<User> findAll();
    Optional<User> findById(Long id);
    User save(User user);
    void deleteById(Long id);
    User createUser(String name, String email, String password);
    User login(String email, String password);
}
