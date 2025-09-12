package com.yourcompany.wedding.weddingbackend.web;

import com.yourcompany.wedding.weddingbackend.dto.WeddingDetailsDTO;
import com.yourcompany.wedding.weddingbackend.dto.WeddingDetailsPageDTO;
import com.yourcompany.wedding.weddingbackend.service.WeddingDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin
public class WeddingDetailsController {

    private final WeddingDetailsService weddingDetailsService;

    /**
     * Aggregated details page (no wedding id).
     * Example: GET /api/details-page
     */
    @GetMapping("/details-page")
    public ResponseEntity<WeddingDetailsPageDTO> getDetailsPage() {
        try {
            WeddingDetailsPageDTO dto = weddingDetailsService.getWeddingDetailsPageData();
            return ResponseEntity.ok(dto);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get the raw details record (first one) if present
     * GET /api/details
     */
    @GetMapping("/details")
    public ResponseEntity<WeddingDetailsDTO> getDetails() {
        return weddingDetailsService.getWeddingDetails()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create or update the details record. Accepts an optional id; if id missing we'll create or update the first record.
     * PUT /api/details
     */
    @PutMapping("/details")
    public ResponseEntity<WeddingDetailsDTO> saveDetails(@RequestBody WeddingDetailsDTO dto) {
        try {
            WeddingDetailsDTO saved = weddingDetailsService.saveWeddingDetails(dto);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
