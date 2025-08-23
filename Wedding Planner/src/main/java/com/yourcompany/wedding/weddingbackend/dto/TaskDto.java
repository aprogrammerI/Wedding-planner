package com.yourcompany.wedding.weddingbackend.dto;

import com.yourcompany.wedding.weddingbackend.model.Assignee;
import com.yourcompany.wedding.weddingbackend.model.Priority;

import java.time.LocalDate;
import java.util.List;

public record TaskDTO(
        Long id,
        String title,
        String description,
        LocalDate dueDate,
        Priority priority,
        Assignee assignee,
        boolean completed,
        boolean reminderEnabled,
        List<SubtaskDTO> subtasks
) {}
