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

    @GetMapping("/details-page")
    public ResponseEntity<WeddingDetailsPageDTO> getDetailsPage(@RequestHeader("X-User-Id") Long userId) {
        try {
            WeddingDetailsPageDTO dto = weddingDetailsService.getWeddingDetailsPageData(userId);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/details")
    public ResponseEntity<WeddingDetailsDTO> getDetails(@RequestHeader("X-User-Id") Long userId) {
        return weddingDetailsService.getWeddingDetails(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/details")
    public ResponseEntity<WeddingDetailsDTO> saveDetails(@RequestHeader("X-User-Id") Long userId, @RequestBody WeddingDetailsDTO dto) {
        try {
            WeddingDetailsDTO saved = weddingDetailsService.saveWeddingDetails(userId, dto);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}