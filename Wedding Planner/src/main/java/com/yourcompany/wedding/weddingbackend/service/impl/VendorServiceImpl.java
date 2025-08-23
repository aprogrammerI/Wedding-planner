package com.yourcompany.wedding.weddingbackend.service.impl;

import com.yourcompany.wedding.weddingbackend.dto.CreateVendorRequest;
import com.yourcompany.wedding.weddingbackend.dto.TaskSummaryDTO;
import com.yourcompany.wedding.weddingbackend.dto.VendorDTO;
import com.yourcompany.wedding.weddingbackend.model.Task;
import com.yourcompany.wedding.weddingbackend.model.Vendor;
import com.yourcompany.wedding.weddingbackend.repository.TaskRepository;
import com.yourcompany.wedding.weddingbackend.repository.VendorRepository;
import com.yourcompany.wedding.weddingbackend.service.VendorService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class VendorServiceImpl implements VendorService {

    private final VendorRepository vendorRepo;
    private final TaskRepository taskRepo;

    @Override
    public List<VendorDTO> getAll() {
        return vendorRepo.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public VendorDTO getById(Long id) {
        Vendor v = vendorRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vendor not found: " + id));
        return toDTO(v);
    }

    @Override
    @Transactional
    public VendorDTO create(CreateVendorRequest request) {
        Vendor v = Vendor.builder()
                .name(request.name())
                .category(request.category())
                .phone(request.phone())
                .email(request.email())
                .website(request.website())
                .build();
        return toDTO(vendorRepo.save(v));
    }

    @Override
    @Transactional
    public VendorDTO update(Long id, CreateVendorRequest request) {
        Vendor v = vendorRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vendor not found: " + id));
        v.setName(request.name());
        v.setCategory(request.category());
        v.setPhone(request.phone());
        v.setEmail(request.email());
        v.setWebsite(request.website());
        return toDTO(vendorRepo.save(v));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        vendorRepo.deleteById(id);
    }

    @Override
    @Transactional
    public VendorDTO assignTask(Long vendorId, Long taskId) {
        Vendor v = vendorRepo.findById(vendorId)
                .orElseThrow(() -> new EntityNotFoundException("Vendor not found: " + vendorId));
        Task t = taskRepo.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found: " + taskId));

        if (Boolean.TRUE.equals(t.isCompleted())) {
            // Never assign completed tasks
            throw new IllegalStateException("Cannot assign a completed task.");
        }
        v.getAssignedTasks().add(t);
        vendorRepo.save(v);
        return toDTO(v);
    }

    @Override
    @Transactional
    public VendorDTO unassignTask(Long vendorId, Long taskId) {
        Vendor v = vendorRepo.findById(vendorId)
                .orElseThrow(() -> new EntityNotFoundException("Vendor not found: " + vendorId));
        v.getAssignedTasks().removeIf(task -> task.getId().equals(taskId));
        vendorRepo.save(v);
        return toDTO(v);
    }

    @Override
    public List<TaskSummaryDTO> getAvailableUnfinishedTasksForVendor(Long vendorId) {
        Vendor v = vendorRepo.findById(vendorId)
                .orElseThrow(() -> new EntityNotFoundException("Vendor not found: " + vendorId));

        Set<Long> assignedIds = v.getAssignedTasks()
                .stream().map(Task::getId).collect(Collectors.toSet());

        // unfinished tasks
        return taskRepo.findByCompleted(false).stream()
                .filter(t -> !assignedIds.contains(t.getId()))
                .sorted(Comparator.comparing(Task::getDueDate, Comparator.nullsLast(Comparator.naturalOrder()))
                        .thenComparing(Task::getTitle))
                .map(this::toSummary)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void unassignTaskFromAllVendors(Long taskId) {
        List<Vendor> vendors = vendorRepo.findAll();
        boolean changed = false;
        for (Vendor v : vendors) {
            boolean removed = v.getAssignedTasks().removeIf(t -> t.getId().equals(taskId));
            if (removed) {
                vendorRepo.save(v);
                changed = true;
            }
        }
        // (changed flag is informational; no special action needed)
    }

    /* ----------------- Mappers ----------------- */

    private VendorDTO toDTO(Vendor v) {
        List<TaskSummaryDTO> tasks = v.getAssignedTasks().stream()
                .filter(t -> !Boolean.TRUE.equals(t.isCompleted())) // safety: do not expose completed here
                .sorted(Comparator.comparing(Task::getDueDate, Comparator.nullsLast(Comparator.naturalOrder()))
                        .thenComparing(Task::getTitle))
                .map(this::toSummary)
                .collect(Collectors.toList());
        return new VendorDTO(
                v.getId(),
                v.getName(),
                v.getCategory(),
                v.getPhone(),
                v.getEmail(),
                v.getWebsite(),
                tasks
        );
    }

    private TaskSummaryDTO toSummary(Task t) {
        return new TaskSummaryDTO(t.getId(), t.getTitle(), t.isCompleted(), t.getDueDate());
    }
}
