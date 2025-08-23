package com.yourcompany.wedding.weddingbackend.service;

import com.yourcompany.wedding.weddingbackend.dto.CreateVendorRequest;
import com.yourcompany.wedding.weddingbackend.dto.TaskSummaryDTO;
import com.yourcompany.wedding.weddingbackend.dto.VendorDTO;

import java.util.List;

public interface VendorService {
    List<VendorDTO> getAll();
    VendorDTO getById(Long id);
    VendorDTO create(CreateVendorRequest request);
    VendorDTO update(Long id, CreateVendorRequest request);
    void delete(Long id);

    // task assignment flows
    VendorDTO assignTask(Long vendorId, Long taskId);
    VendorDTO unassignTask(Long vendorId, Long taskId);

    // for the dropdown: unfinished tasks not already assigned to this vendor
    List<TaskSummaryDTO> getAvailableUnfinishedTasksForVendor(Long vendorId);

    // cleanup helpers used by TaskService when tasks are completed/deleted
    void unassignTaskFromAllVendors(Long taskId);
}
