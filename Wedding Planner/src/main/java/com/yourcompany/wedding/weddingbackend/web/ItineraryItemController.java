package com.yourcompany.wedding.weddingbackend.web;

import com.yourcompany.wedding.weddingbackend.dto.ItineraryItemDTO;
import com.yourcompany.wedding.weddingbackend.service.ItineraryItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/itinerary") // Changed to global mapping
@RequiredArgsConstructor
public class ItineraryItemController {

    private final ItineraryItemService itineraryItemService;

    @GetMapping
    public List<ItineraryItemDTO> getItinerary() { // Removed weddingId
        return itineraryItemService.getItinerary();
    }

    @PostMapping
    public ResponseEntity<ItineraryItemDTO> addItineraryItem(@RequestBody ItineraryItemDTO dto) { // Removed weddingId
        try {
            ItineraryItemDTO newItem = itineraryItemService.addItineraryItem(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(newItem);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null); // Keep conflict for double booking
        }
    }

    @PutMapping("/{itemId}")
    public ResponseEntity<ItineraryItemDTO> updateItineraryItem(@PathVariable Long itemId, @RequestBody ItineraryItemDTO dto) { // Removed weddingId
        try {
            ItineraryItemDTO updatedItem = itineraryItemService.updateItineraryItem(itemId, dto);
            return ResponseEntity.ok(updatedItem);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null); // Keep conflict for double booking
        }
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<Void> deleteItineraryItem(@PathVariable Long itemId) { // Removed weddingId
        itineraryItemService.deleteItineraryItem(itemId);
        return ResponseEntity.noContent().build();
    }
}