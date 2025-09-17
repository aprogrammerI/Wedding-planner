package com.yourcompany.wedding.weddingbackend.repository;

import com.yourcompany.wedding.weddingbackend.model.WeddingDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WeddingDetailsRepository extends JpaRepository<WeddingDetails, Long> {
    Optional<WeddingDetails> findTopByOwnerIdOrderByIdAsc(Long ownerId);
}