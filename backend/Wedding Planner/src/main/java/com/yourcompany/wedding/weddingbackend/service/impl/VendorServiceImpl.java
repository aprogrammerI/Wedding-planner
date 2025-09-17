package com.yourcompany.wedding.weddingbackend.service.impl;

import com.yourcompany.wedding.weddingbackend.dto.CreateVendorRequest;
import com.yourcompany.wedding.weddingbackend.dto.TaskSummaryDTO;
import com.yourcompany.wedding.weddingbackend.dto.VendorDTO;
import com.yourcompany.wedding.weddingbackend.model.Task;
import com.yourcompany.wedding.weddingbackend.model.Vendor;
import com.yourcompany.wedding.weddingbackend.repository.TaskRepository;
import com.yourcompany.wedding.weddingbackend.repository.VendorRepository;
import com.yourcompany.wedding.weddingbackend.service.VendorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class VendorServiceImpl implements VendorService {

    private final VendorRepository vendorRepo;
    private final TaskRepository taskRepo;

    @Override
    @Transactional
    public VendorDTO create(Long userId, CreateVendorRequest request) {
        Vendor v = Vendor.builder()
                .ownerId(userId)
                .name(request.name())
                .category(request.category())
                .phone(request.phone())
                .email(request.email())
                .website(request.website())
                .build();
        return toDTO(vendorRepo.save(v));
    }

    @Override
    public List<VendorDTO> getAll(Long userId) {
        return vendorRepo.findByOwnerId(userId).stream().map(this::toDTO).toList();
    }

    @Override
    public VendorDTO getById(Long userId, Long id) {
        Vendor v = vendorRepo.findById(id).orElseThrow(() -> new RuntimeException("Vendor not found"));
        if (!userId.equals(v.getOwnerId())) throw new RuntimeException("Forbidden");
        return toDTO(v);
    }

    @Override
    @Transactional
    public VendorDTO update(Long userId, Long id, CreateVendorRequest request) {
        Vendor v = vendorRepo.findById(id).orElseThrow(() -> new RuntimeException("Vendor not found"));
        if (!userId.equals(v.getOwnerId())) throw new RuntimeException("Forbidden");
        v.setName(request.name());
        v.setCategory(request.category());
        v.setPhone(request.phone());
        v.setEmail(request.email());
        v.setWebsite(request.website());
        return toDTO(vendorRepo.save(v));
    }

    @Override
    @Transactional
    public void delete(Long userId, Long id) {
        Vendor v = vendorRepo.findById(id).orElseThrow(() -> new RuntimeException("Vendor not found"));
        if (!userId.equals(v.getOwnerId())) throw new RuntimeException("Forbidden");
        vendorRepo.delete(v);
    }

    @Override
    @Transactional
    public VendorDTO assignTask(Long userId, Long vendorId, Long taskId) {
        Vendor v = vendorRepo.findById(vendorId).orElseThrow(() -> new RuntimeException("Vendor not found"));
        if (!userId.equals(v.getOwnerId())) throw new RuntimeException("Forbidden");

        Task t = taskRepo.findById(taskId).orElseThrow(() -> new RuntimeException("Task not found"));
        if (!userId.equals(t.getOwnerId())) throw new RuntimeException("Forbidden");

        v.getAssignedTasks().add(t);
        return toDTO(vendorRepo.save(v));
    }

    @Override
    @Transactional
    public VendorDTO unassignTask(Long userId, Long vendorId, Long taskId) {
        Vendor v = vendorRepo.findById(vendorId).orElseThrow(() -> new RuntimeException("Vendor not found"));
        if (!userId.equals(v.getOwnerId())) throw new RuntimeException("Forbidden");

        v.getAssignedTasks().removeIf(t -> t.getId().equals(taskId));
        return toDTO(vendorRepo.save(v));
    }

    @Override
    public List<TaskSummaryDTO> getAvailableUnfinishedTasksForVendor(Long userId, Long vendorId) {
        Vendor v = vendorRepo.findById(vendorId).orElseThrow(() -> new RuntimeException("Vendor not found"));
        if (!userId.equals(v.getOwnerId())) throw new RuntimeException("Forbidden");

        var vendorTaskIds = v.getAssignedTasks().stream().map(Task::getId).toList();

        return taskRepo.findByOwnerId(userId).stream()
                .filter(t -> !t.isCompleted())
                .filter(t -> !vendorTaskIds.contains(t.getId()))
                .map(t -> new TaskSummaryDTO(t.getId(), t.getTitle(), t.isCompleted(), t.getDueDate()))
                .toList();
    }

    @Override
    @Transactional
    public void unassignTaskFromAllVendors(Long taskId) {
        vendorRepo.findAll().forEach(v -> {
            if (v.getAssignedTasks().removeIf(t -> t.getId().equals(taskId))) {
                vendorRepo.save(v);
            }
        });
    }

    private VendorDTO toDTO(Vendor v) {
        var assigned = v.getAssignedTasks() == null ? List.<TaskSummaryDTO>of()
                : v.getAssignedTasks().stream()
                .map(t -> new TaskSummaryDTO(t.getId(), t.getTitle(), t.isCompleted(), t.getDueDate()))
                .toList();
        return new VendorDTO(v.getId(), v.getName(), v.getCategory(), v.getPhone(), v.getEmail(), v.getWebsite(), assigned);
    }
}