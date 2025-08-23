//package com.yourcompany.wedding.weddingbackend.service;
//
//import com.yourcompany.wedding.weddingbackend.model.Guest;
//import com.yourcompany.wedding.weddingbackend.model.GuestRole;
//import com.yourcompany.wedding.weddingbackend.model.GuestSide;
//import com.yourcompany.wedding.weddingbackend.model.RsvpStatus;
//
//import java.util.List;
//import java.util.Optional;
//
//public interface GuestService {
//    List<Guest> findAll();
//    Optional<Guest> findById(Long id);
//    Guest save(Guest guest);
//    void deleteById(Long id);
//
//    // New methods for filtering and sorting
//    List<Guest> findAllSorted(String sortBy, String sortOrder);
//    List<Guest> findBySideSorted(GuestSide side, String sortBy, String sortOrder);
//    List<Guest> findByRoleSorted(GuestRole role, String sortBy, String sortOrder);
//    List<Guest> findByRsvpStatusSorted(RsvpStatus rsvpStatus, String sortBy, String sortOrder);
//}


package com.yourcompany.wedding.weddingbackend.service;

import com.yourcompany.wedding.weddingbackend.model.Guest;
import com.yourcompany.wedding.weddingbackend.model.GuestRole;
import com.yourcompany.wedding.weddingbackend.model.GuestSide;
import com.yourcompany.wedding.weddingbackend.model.RsvpStatus;

import java.util.List;
import java.util.Optional;

public interface GuestService {
    Optional<Guest> findById(Long id);
    Guest save(Guest guest);
    void deleteById(Long id);

    // New method for complex grouping and sorting
    List<Guest> findAllGuests(String groupBy, String sortBy, String sortOrder);
}