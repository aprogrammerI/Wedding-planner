package com.yourcompany.wedding.weddingbackend.web;

import com.yourcompany.wedding.weddingbackend.dto.ItineraryItemDTO;
import com.yourcompany.wedding.weddingbackend.service.ItineraryItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/itinerary")
@RequiredArgsConstructor
public class ItineraryItemController {

    private final ItineraryItemService itineraryItemService;

    @GetMapping
    public List<ItineraryItemDTO> getItinerary(@RequestHeader("X-User-Id") Long userId) {
        return itineraryItemService.getItinerary(userId);
    }

    @PostMapping
    public ResponseEntity<ItineraryItemDTO> addItineraryItem(@RequestHeader("X-User-Id") Long userId, @RequestBody ItineraryItemDTO dto) {
        try {
            ItineraryItemDTO newItem = itineraryItemService.addItineraryItem(userId, dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(newItem);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
    }

    @PutMapping("/{itemId}")
    public ResponseEntity<ItineraryItemDTO> updateItineraryItem(@RequestHeader("X-User-Id") Long userId, @PathVariable Long itemId, @RequestBody ItineraryItemDTO dto) {
        try {
            ItineraryItemDTO updatedItem = itineraryItemService.updateItineraryItem(userId, itemId, dto);
            return ResponseEntity.ok(updatedItem);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<Void> deleteItineraryItem(@RequestHeader("X-User-Id") Long userId, @PathVariable Long itemId) {
        itineraryItemService.deleteItineraryItem(userId, itemId);
        return ResponseEntity.noContent().build();
    }
}