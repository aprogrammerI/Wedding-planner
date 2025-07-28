package com.yourcompany.wedding.weddingbackend.web;


import com.yourcompany.wedding.weddingbackend.dto.WeddingDto;
import com.yourcompany.wedding.weddingbackend.model.Wedding;
import com.yourcompany.wedding.weddingbackend.service.UserService;
import com.yourcompany.wedding.weddingbackend.service.WeddingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/weddings")
public class WeddingController {
    private final WeddingService weddingService;
    private final UserService userService;

    @Autowired
    public WeddingController(WeddingService weddingService, UserService userService) {
        this.weddingService = weddingService;
        this.userService = userService;
    }

    @GetMapping
    public List<WeddingDto> getAll() {
        return weddingService.findAll().stream()
                .map(w -> new WeddingDto(w.getId(), w.getName(), w.getDate(), w.getLocation(), w.getDescription(), w.getPlanner().getId()))
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WeddingDto> getById(@PathVariable Long id) {
        return weddingService.findById(id)
                .map(w -> ResponseEntity.ok(new WeddingDto(w.getId(), w.getName(), w.getDate(), w.getLocation(), w.getDescription(), w.getPlanner().getId())))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public WeddingDto create(@RequestBody WeddingDto dto) {
        Wedding w = Wedding.builder()
                .name(dto.getName())
                .date(dto.getDate())
                .location(dto.getLocation())
                .description(dto.getDescription())
                .planner(userService.findById(dto.getPlannerId()).orElse(null))
                .build();
        Wedding saved = weddingService.save(w);
        return new WeddingDto(saved.getId(), saved.getName(), saved.getDate(), saved.getLocation(), saved.getDescription(), saved.getPlanner().getId());
    }

    @PutMapping("/{id}")
    public ResponseEntity<WeddingDto> update(@PathVariable Long id, @RequestBody WeddingDto dto) {
        return weddingService.findById(id).map(existing -> {
            existing.setName(dto.getName());
            existing.setDate(dto.getDate());
            existing.setLocation(dto.getLocation());
            existing.setDescription(dto.getDescription());
            existing.setPlanner(userService.findById(dto.getPlannerId()).orElse(existing.getPlanner()));
            Wedding updated = weddingService.save(existing);
            return ResponseEntity.ok(new WeddingDto(updated.getId(), updated.getName(), updated.getDate(), updated.getLocation(), updated.getDescription(), updated.getPlanner().getId()));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        weddingService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}