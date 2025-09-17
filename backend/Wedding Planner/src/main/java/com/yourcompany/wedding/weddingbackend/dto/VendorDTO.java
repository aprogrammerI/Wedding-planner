package com.yourcompany.wedding.weddingbackend.dto;



import java.util.List;

public record VendorDTO(
        Long id,
        String name,
        String category,
        String phone,
        String email,
        String website,
        List<TaskSummaryDTO> assignedTasks
) {}

