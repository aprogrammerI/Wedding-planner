
package com.yourcompany.wedding.weddingbackend.web;

import com.yourcompany.wedding.weddingbackend.dto.GuestDto;
import com.yourcompany.wedding.weddingbackend.model.Guest;
import com.yourcompany.wedding.weddingbackend.model.RsvpStatus;
import com.yourcompany.wedding.weddingbackend.service.GuestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.openapitools.jackson.nullable.JsonNullable;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/guests")
@RequiredArgsConstructor
public class GuestController {

    private final GuestService guestService;

    private GuestDto convertToDto(Guest guest) {
        return GuestDto.builder()
                .id(guest.getId())
                .name(guest.getName())
                // Wrap existing Guest fields in JsonNullable.of()
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
            @RequestParam(required = false) String groupBy,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false, defaultValue = "ASC") String sortOrder) {

        List<Guest> guests = guestService.findAllGuests(groupBy, sortBy, sortOrder);

        return guests.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GuestDto> getById(@PathVariable Long id) {
        return guestService.findById(id)
                .map(this::convertToDto) // Use the helper method
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    @PostMapping
    public GuestDto create(@RequestBody GuestDto dto) {
        Guest g = Guest.builder()

                .name(dto.getName())

                .side(dto.getSide().orElse(null))
                .role(dto.getRole().orElse(null))

                .rsvpStatus(RsvpStatus.PENDING)

                .tableNumber(null)
                .mealPlan(null)
                .comments(null)
                .build();
        Guest saved = guestService.save(g);
        return convertToDto(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GuestDto> update(@PathVariable Long id, @RequestBody GuestDto dto) {
        return guestService.findById(id).map(existing -> {

            if (dto.getName() != null) {
                existing.setName(dto.getName());
            }


            dto.getRsvpStatus().ifPresent(existing::setRsvpStatus);
            dto.getSide().ifPresent(existing::setSide);
            dto.getRole().ifPresent(existing::setRole);
            dto.getTableNumber().ifPresent(existing::setTableNumber);
            dto.getMealPlan().ifPresent(existing::setMealPlan);
            dto.getComments().ifPresent(existing::setComments);

            Guest updated = guestService.save(existing);
            return ResponseEntity.ok(convertToDto(updated));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        guestService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}


