package com.yourcompany.wedding.weddingbackend.service;

import com.yourcompany.wedding.weddingbackend.dto.ItineraryItemDTO;

import java.util.List;

public interface ItineraryItemService {
    List<ItineraryItemDTO> getItinerary(Long userId);
    ItineraryItemDTO addItineraryItem(Long userId, ItineraryItemDTO dto);
    ItineraryItemDTO updateItineraryItem(Long userId, Long itemId, ItineraryItemDTO dto);
    void deleteItineraryItem(Long userId, Long itemId);
}