package com.yourcompany.wedding.weddingbackend.service;

import com.yourcompany.wedding.weddingbackend.model.Wedding;

import java.util.List;
import java.util.Optional;

public interface WeddingService {
    List<Wedding> findAll();
    Optional<Wedding> findById(Long id);
    Wedding save(Wedding wedding);
    void deleteById(Long id);
}
