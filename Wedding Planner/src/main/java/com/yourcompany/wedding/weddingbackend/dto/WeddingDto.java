package com.yourcompany.wedding.weddingbackend.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeddingDto {
    private Long id;
    private String name;
    private LocalDate date;
    private String location;
    private String description;
    private Long plannerId;
}
