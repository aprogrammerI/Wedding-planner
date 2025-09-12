package com.yourcompany.wedding.weddingbackend.repository;

import com.yourcompany.wedding.weddingbackend.model.ItineraryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;

@Repository
public interface ItineraryItemRepository extends JpaRepository<ItineraryItem, Long> {
    // Removed findByWeddingIdOrderByTimeAsc as it's no longer needed for a global scope
    List<ItineraryItem> findAllByOrderByTimeAsc();

    // For double booking check, now globally
    List<ItineraryItem> findByTime(LocalTime time);
}