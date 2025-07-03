package com.yourcompany.wedding.weddingbackend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GuestDto {
    private Long id;
    private String name;
    private boolean rsvp;
    private String dietaryPreferences;
    private Long weddingId;
}