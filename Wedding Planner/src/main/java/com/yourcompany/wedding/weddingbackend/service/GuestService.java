package com.yourcompany.wedding.weddingbackend.service;

import com.yourcompany.wedding.weddingbackend.model.Guest;

import java.util.List;
import java.util.Optional;

public interface GuestService {
    List<Guest> findAll();
    Optional<Guest> findById(Long id);
    Guest save(Guest guest);
    void deleteById(Long id);
}
