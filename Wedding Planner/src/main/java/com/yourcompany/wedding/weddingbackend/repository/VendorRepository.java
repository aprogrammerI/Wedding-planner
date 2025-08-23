package com.yourcompany.wedding.weddingbackend.repository;

import com.yourcompany.wedding.weddingbackend.model.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VendorRepository extends JpaRepository<Vendor, Long> {
}
