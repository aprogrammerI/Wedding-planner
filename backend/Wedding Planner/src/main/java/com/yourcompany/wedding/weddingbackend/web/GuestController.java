package com.yourcompany.wedding.weddingbackend.web;

import com.yourcompany.wedding.weddingbackend.dto.GuestDto;
import com.yourcompany.wedding.weddingbackend.model.Guest;
import com.yourcompany.wedding.weddingbackend.model.RsvpStatus;
import com.yourcompany.wedding.weddingbackend.service.GuestService;
import lombok.RequiredArgsConstructor;
import org.openapitools.jackson.nullable.JsonNullable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/guests")
@CrossOrigin
@RequiredArgsConstructor
public class GuestController {

    private final GuestService guestService;

    private GuestDto convertToDto(Guest guest) {
        return GuestDto.builder()
                .id(guest.getId())
                .name(guest.getName())
                .rsvpStatus(JsonNullable.of(guest.getRsvpStatus()))
                .side(JsonNullable.of(guest.getSide()))
                .role(JsonNullable.of(guest.getRole()))
                .tableNumber(JsonNullable.of(guest.getTableNumber()))
                .mealPlan(JsonNullable.of(guest.getMealPlan()))
                .comments(JsonNullable.of(guest.getComments()))
                .build();
    }

    @GetMapping
    public List<GuestDto> getAll(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam(required = false) String groupBy,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false, defaultValue = "ASC") String sortOrder) {

        List<Guest> guests = guestService.findAll(userId, groupBy, sortBy, sortOrder);
        return guests.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GuestDto> getById(@RequestHeader("X-User-Id") Long userId, @PathVariable Long id) {
        return guestService.findById(userId, id)
                .map(this::convertToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    @PostMapping
    public GuestDto create(@RequestHeader("X-User-Id") Long userId, @RequestBody GuestDto dto) {
        Guest g = Guest.builder()
                .ownerId(userId)
                .name(dto.getName())
                .side(dto.getSide().orElse(null))
                .role(dto.getRole().orElse(null))
                .rsvpStatus(RsvpStatus.PENDING)
                .tableNumber(null)
                .mealPlan(null)
                .comments(null)
                .build();
        Guest saved = guestService.save(userId, g);
        return convertToDto(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GuestDto> update(@RequestHeader("X-User-Id") Long userId, @PathVariable Long id, @RequestBody GuestDto dto) {
        return guestService.findById(userId, id).map(existing -> {
            if (dto.getName() != null) existing.setName(dto.getName());
            dto.getRsvpStatus().ifPresent(existing::setRsvpStatus);
            dto.getSide().ifPresent(existing::setSide);
            dto.getRole().ifPresent(existing::setRole);
            dto.getTableNumber().ifPresent(existing::setTableNumber);
            dto.getMealPlan().ifPresent(existing::setMealPlan);
            dto.getComments().ifPresent(existing::setComments);
            Guest updated = guestService.save(userId, existing);
            return ResponseEntity.ok(convertToDto(updated));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@RequestHeader("X-User-Id") Long userId, @PathVariable Long id) {
        guestService.deleteById(userId, id);
        return ResponseEntity.noContent().build();
    }
}