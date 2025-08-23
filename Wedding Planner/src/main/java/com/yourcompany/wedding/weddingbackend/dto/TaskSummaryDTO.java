package com.yourcompany.wedding.weddingbackend.dto;

import java.time.LocalDate;

public record TaskSummaryDTO(
        Long id,
        String title,
        boolean completed,
        LocalDate dueDate
) {}
