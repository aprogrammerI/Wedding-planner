package com.yourcompany.wedding.weddingbackend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskDto {
    private Long id;
    private String description;
    private boolean completed;
    private Long weddingId;
    private Long assignedToId;
}