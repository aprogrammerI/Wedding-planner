package com.yourcompany.wedding.weddingbackend.repository;

import com.yourcompany.wedding.weddingbackend.model.WeddingDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WeddingDetailsRepository extends JpaRepository<WeddingDetails, Long> {
    // Basic CRUD; details are independent now
}
