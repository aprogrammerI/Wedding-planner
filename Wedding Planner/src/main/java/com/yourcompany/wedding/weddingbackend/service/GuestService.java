package com.yourcompany.wedding.weddingbackend.service;

import com.yourcompany.wedding.weddingbackend.model.Guest;
import com.yourcompany.wedding.weddingbackend.model.GuestRole;
import com.yourcompany.wedding.weddingbackend.model.GuestSide;
import com.yourcompany.wedding.weddingbackend.model.RsvpStatus;

import java.util.List;
import java.util.Optional;

public interface GuestService {
    List<Guest> findAll(Long userId, String groupBy, String sortBy, String sortOrder);
    Optional<Guest> findById(Long userId, Long id);
    Guest save(Long userId, Guest guest);
    void deleteById(Long userId, Long id);
    List<Guest> findAllSorted(Long userId, String sortBy, String sortOrder);
    List<Guest> findBySideSorted(Long userId, GuestSide side, String sortBy, String sortOrder);
    List<Guest> findByRoleSorted(Long userId, GuestRole role, String sortBy, String sortOrder);
    List<Guest> findByRsvpStatusSorted(Long userId, RsvpStatus rsvpStatus, String sortBy, String sortOrder);
}