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
    List<Guest> findAll(Sort sort);
    List<Guest> findBySide(GuestSide side, Sort sort);
    List<Guest> findByRole(GuestRole role, Sort sort);
    List<Guest> findByRsvpStatus(RsvpStatus rsvpStatus, Sort sort);
    // Removed findByWeddingId as it's no longer needed for a global scope
}