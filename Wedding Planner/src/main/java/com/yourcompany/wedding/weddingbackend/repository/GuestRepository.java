package com.yourcompany.wedding.weddingbackend.repository;

import com.yourcompany.wedding.weddingbackend.model.Guest;
import com.yourcompany.wedding.weddingbackend.model.GuestRole;
import com.yourcompany.wedding.weddingbackend.model.GuestSide;
import com.yourcompany.wedding.weddingbackend.model.RsvpStatus;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GuestRepository extends JpaRepository<Guest, Long> {

    // Per-user versions of previous global methods
    List<Guest> findByOwnerId(Long ownerId);
    List<Guest> findByOwnerId(Long ownerId, Sort sort);
    List<Guest> findByOwnerIdAndSide(Long ownerId, GuestSide side, Sort sort);
    List<Guest> findByOwnerIdAndRole(Long ownerId, GuestRole role, Sort sort);
    List<Guest> findByOwnerIdAndRsvpStatus(Long ownerId, RsvpStatus rsvpStatus, Sort sort);
}