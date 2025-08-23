package com.yourcompany.wedding.weddingbackend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private Long id;
    private String email; // Renamed from username
    private String role; // ADMIN, PLANNER, GUEST, VENDOR
}