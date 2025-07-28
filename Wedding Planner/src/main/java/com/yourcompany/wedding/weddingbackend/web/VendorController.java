package com.yourcompany.wedding.weddingbackend.web;


import com.yourcompany.wedding.weddingbackend.dto.VendorDto;
import com.yourcompany.wedding.weddingbackend.model.Vendor;
import com.yourcompany.wedding.weddingbackend.service.VendorService;
import com.yourcompany.wedding.weddingbackend.service.WeddingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/vendors")
public class VendorController {
    private final VendorService vendorService;
    private final WeddingService weddingService;

    @Autowired
    public VendorController(VendorService vendorService, WeddingService weddingService) {
        this.vendorService = vendorService;
        this.weddingService = weddingService;
    }

    @GetMapping
    public List<VendorDto> getAll() {
        return vendorService.findAll().stream()
                .map(v -> new VendorDto(v.getId(), v.getName(), v.getServiceType(), v.getContactInfo(), v.getWedding().getId()))
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VendorDto> getById(@PathVariable Long id) {
        return vendorService.findById(id)
                .map(v -> ResponseEntity.ok(new VendorDto(v.getId(), v.getName(), v.getServiceType(), v.getContactInfo(), v.getWedding().getId())))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public VendorDto create(@RequestBody VendorDto dto) {
        Vendor v = Vendor.builder()
                .name(dto.getName())
                .serviceType(dto.getServiceType())
                .contactInfo(dto.getContactInfo())
                .wedding(weddingService.findById(dto.getWeddingId()).orElse(null))
                .build();
        Vendor saved = vendorService.save(v);
        return new VendorDto(saved.getId(), saved.getName(), saved.getServiceType(), saved.getContactInfo(), saved.getWedding().getId());
    }

    @PutMapping("/{id}")
    public ResponseEntity<VendorDto> update(@PathVariable Long id, @RequestBody VendorDto dto) {
        return vendorService.findById(id).map(existing -> {
            existing.setName(dto.getName());
            existing.setServiceType(dto.getServiceType());
            existing.setContactInfo(dto.getContactInfo());
            existing.setWedding(weddingService.findById(dto.getWeddingId()).orElse(existing.getWedding()));
            Vendor updated = vendorService.save(existing);
            return ResponseEntity.ok(new VendorDto(updated.getId(), updated.getName(), updated.getServiceType(), updated.getContactInfo(), updated.getWedding().getId()));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        vendorService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
