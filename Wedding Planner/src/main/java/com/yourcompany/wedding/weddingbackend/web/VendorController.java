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

    // Create
    @PostMapping
    public VendorDTO create(@RequestBody CreateVendorRequest request) {
        return vendorService.create(request);
    }

    // Read
    @GetMapping
    public List<VendorDTO> getAll() {
        return vendorService.getAll();
    }

    @GetMapping("/{id}")
    public VendorDTO getById(@PathVariable Long id) {
        return vendorService.getById(id);
    }

    // Update
    @PutMapping("/{id}")
    public VendorDTO update(@PathVariable Long id, @RequestBody CreateVendorRequest request) {
        return vendorService.update(id, request);
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        vendorService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // Assign / Unassign
    @PostMapping("/{vendorId}/assign")
    public VendorDTO assignTask(@PathVariable Long vendorId, @RequestParam Long taskId) {
        return vendorService.assignTask(vendorId, taskId);
    }

    @DeleteMapping("/{vendorId}/assign/{taskId}")
    public VendorDTO unassignTask(@PathVariable Long vendorId, @PathVariable Long taskId) {
        return vendorService.unassignTask(vendorId, taskId);
    }

    // Dropdown: unfinished + not already assigned
    @GetMapping("/{vendorId}/available-tasks")
    public List<TaskSummaryDTO> getAvailableTasks(@PathVariable Long vendorId) {
        return vendorService.getAvailableUnfinishedTasksForVendor(vendorId);
    }
}
