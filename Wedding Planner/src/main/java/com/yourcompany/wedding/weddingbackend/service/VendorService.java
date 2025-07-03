package com.yourcompany.wedding.weddingbackend.service;

import com.yourcompany.wedding.weddingbackend.model.Vendor;

import java.util.List;
import java.util.Optional;

public interface VendorService {
    List<Vendor> findAll();
    Optional<Vendor> findById(Long id);
    Vendor save(Vendor vendor);
    void deleteById(Long id);
}
