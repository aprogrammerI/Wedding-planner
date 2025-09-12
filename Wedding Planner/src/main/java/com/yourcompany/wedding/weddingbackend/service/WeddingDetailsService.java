package com.yourcompany.wedding.weddingbackend.service;

import com.yourcompany.wedding.weddingbackend.dto.WeddingDetailsDTO;
import com.yourcompany.wedding.weddingbackend.dto.WeddingDetailsPageDTO;

import java.util.Optional;

public interface WeddingDetailsService {
    Optional<WeddingDetailsDTO> getWeddingDetails(); // returns the single details record if present
    WeddingDetailsDTO saveWeddingDetails(WeddingDetailsDTO dto);

    /**
     * Aggregates the data needed by the frontend details page.
     * This method does NOT assume WeddingDetails is linked to Wedding.
     * It pulls data from existing repositories/services:
     * - guests, itinerary, expenses (by single wedding id if present else globally)
     * - taskService.getProgress() for tasks
     * - budgets list (pick first) for budgets
     */
    WeddingDetailsPageDTO getWeddingDetailsPageData();
}
