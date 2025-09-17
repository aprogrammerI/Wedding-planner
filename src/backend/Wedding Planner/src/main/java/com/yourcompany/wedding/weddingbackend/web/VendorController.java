package com.yourcompany.wedding.weddingbackend.web;

import com.yourcompany.wedding.weddingbackend.dto.CreateVendorRequest;
import com.yourcompany.wedding.weddingbackend.dto.TaskSummaryDTO;
import com.yourcompany.wedding.weddingbackend.dto.VendorDTO;
import com.yourcompany.wedding.weddingbackend.service.VendorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/vendors")
@RequiredArgsConstructor
public class VendorController {

    private final VendorService vendorService;

    @PostMapping
    public VendorDTO create(@RequestHeader("X-User-Id") Long userId, @RequestBody CreateVendorRequest request) {
        return vendorService.create(userId, request);
    }

    @GetMapping
    public List<VendorDTO> getAll(@RequestHeader("X-User-Id") Long userId) {
        return vendorService.getAll(userId);
    }

    @GetMapping("/{id}")
    public VendorDTO getById(@RequestHeader("X-User-Id") Long userId, @PathVariable Long id) {
        return vendorService.getById(userId, id);
    }

    @PutMapping("/{id}")
    public VendorDTO update(@RequestHeader("X-User-Id") Long userId, @PathVariable Long id, @RequestBody CreateVendorRequest request) {
        return vendorService.update(userId, id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@RequestHeader("X-User-Id") Long userId, @PathVariable Long id) {
        vendorService.delete(userId, id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{vendorId}/assign")
    public VendorDTO assignTask(@RequestHeader("X-User-Id") Long userId, @PathVariable Long vendorId, @RequestParam Long taskId) {
        return vendorService.assignTask(userId, vendorId, taskId);
    }

    @DeleteMapping("/{vendorId}/assign/{taskId}")
    public VendorDTO unassignTask(@RequestHeader("X-User-Id") Long userId, @PathVariable Long vendorId, @PathVariable Long taskId) {
        return vendorService.unassignTask(userId, vendorId, taskId);
    }

    @GetMapping("/{vendorId}/available-tasks")
    public List<TaskSummaryDTO> getAvailableTasks(@RequestHeader("X-User-Id") Long userId, @PathVariable Long vendorId) {
        return vendorService.getAvailableUnfinishedTasksForVendor(userId, vendorId);
    }
}