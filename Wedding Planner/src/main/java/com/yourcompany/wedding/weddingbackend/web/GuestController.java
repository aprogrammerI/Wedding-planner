package com.yourcompany.wedding.weddingbackend.web;

import com.yourcompany.wedding.weddingbackend.dto.GuestDto;
import com.yourcompany.wedding.weddingbackend.model.Guest;
import com.yourcompany.wedding.weddingbackend.service.GuestService;
import com.yourcompany.wedding.weddingbackend.service.WeddingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/guests")
public class GuestController {
    private final GuestService guestService;
    private final WeddingService weddingService;

    @Autowired
    public GuestController(GuestService guestService, WeddingService weddingService) {
        this.guestService = guestService;
        this.weddingService = weddingService;
    }

    @GetMapping
    public List<GuestDto> getAll() {
        return guestService.findAll().stream()
                .map(g -> new GuestDto(g.getId(), g.getName(), g.isRsvp(), g.getDietaryPreferences(), g.getWedding().getId()))
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GuestDto> getById(@PathVariable Long id) {
        return guestService.findById(id)
                .map(g -> ResponseEntity.ok(new GuestDto(g.getId(), g.getName(), g.isRsvp(), g.getDietaryPreferences(), g.getWedding().getId())))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public GuestDto create(@RequestBody GuestDto dto) {
        Guest g = Guest.builder()
                .name(dto.getName())
                .rsvp(dto.isRsvp())
                .dietaryPreferences(dto.getDietaryPreferences())
                .wedding(weddingService.findById(dto.getWeddingId()).orElse(null))
                .build();
        Guest saved = guestService.save(g);
        return new GuestDto(saved.getId(), saved.getName(), saved.isRsvp(), saved.getDietaryPreferences(), saved.getWedding().getId());
    }

    @PutMapping("/{id}")
    public ResponseEntity<GuestDto> update(@PathVariable Long id, @RequestBody GuestDto dto) {
        return guestService.findById(id).map(existing -> {
            existing.setName(dto.getName());
            existing.setRsvp(dto.isRsvp());
            existing.setDietaryPreferences(dto.getDietaryPreferences());
            existing.setWedding(weddingService.findById(dto.getWeddingId()).orElse(existing.getWedding()));
            Guest updated = guestService.save(existing);
            return ResponseEntity.ok(new GuestDto(updated.getId(), updated.getName(), updated.isRsvp(), updated.getDietaryPreferences(), updated.getWedding().getId()));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        guestService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
