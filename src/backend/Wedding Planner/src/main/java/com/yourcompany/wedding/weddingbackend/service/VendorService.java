package com.yourcompany.wedding.weddingbackend.service;

import com.yourcompany.wedding.weddingbackend.dto.CreateVendorRequest;
import com.yourcompany.wedding.weddingbackend.dto.TaskSummaryDTO;
import com.yourcompany.wedding.weddingbackend.dto.VendorDTO;

import java.util.List;

public interface VendorService {
    VendorDTO create(Long userId, CreateVendorRequest request);
    List<VendorDTO> getAll(Long userId);
    VendorDTO getById(Long userId, Long id);
    VendorDTO update(Long userId, Long id, CreateVendorRequest request);
    void delete(Long userId, Long id);
    VendorDTO assignTask(Long userId, Long vendorId, Long taskId);
    VendorDTO unassignTask(Long userId, Long vendorId, Long taskId);
    List<TaskSummaryDTO> getAvailableUnfinishedTasksForVendor(Long userId, Long vendorId);
    void unassignTaskFromAllVendors(Long taskId);
}