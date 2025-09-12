package com.yourcompany.wedding.weddingbackend.service;

import com.yourcompany.wedding.weddingbackend.dto.ItineraryItemDTO;

import java.time.LocalTime;
import java.util.List;

public interface ItineraryItemService {

    // List<ItineraryItemDTO> getItineraryForWedding(Long weddingId);
    // ItineraryItemDTO addItineraryItem(Long weddingId, ItineraryItemDTO itineraryItemDTO);
    // ItineraryItemDTO updateItineraryItem(Long weddingId, Long itemId, ItineraryItemDTO updatedItemDTO);
    // void deleteItineraryItem(Long weddingId, Long itemId);


    List<ItineraryItemDTO> getItinerary();
    ItineraryItemDTO addItineraryItem(ItineraryItemDTO itineraryItemDTO);
    ItineraryItemDTO updateItineraryItem(Long itemId, ItineraryItemDTO updatedItemDTO);
    void deleteItineraryItem(Long itemId);

    // boolean isDoubleBooked(Long weddingId, LocalTime time, Long currentItemId);

    boolean isDoubleBooked(LocalTime time, Long currentItemId);
}