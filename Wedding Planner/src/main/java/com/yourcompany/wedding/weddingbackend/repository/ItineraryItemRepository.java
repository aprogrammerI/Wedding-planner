package com.yourcompany.wedding.weddingbackend.repository;

import com.yourcompany.wedding.weddingbackend.model.ItineraryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;

@Repository
public interface ItineraryItemRepository extends JpaRepository<ItineraryItem, Long> {
    List<ItineraryItem> findByOwnerIdOrderByTimeAsc(Long ownerId);

    // For duplicate prevention
//    boolean existsByOwnerIdAndTimeAndEventNameIgnoreCase(Long ownerId, LocalTime time, String eventName);
//    List<ItineraryItem> findByOwnerIdAndTime(Long ownerId, LocalTime time);
}