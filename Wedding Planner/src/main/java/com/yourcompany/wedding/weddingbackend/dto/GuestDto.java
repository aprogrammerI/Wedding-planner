// File: src/main/java/com/yourcompany/wedding/weddingbackend/dto/GuestDto.java
package com.yourcompany.wedding.weddingbackend.dto;

import com.yourcompany.wedding.weddingbackend.model.GuestRole;
import com.yourcompany.wedding.weddingbackend.model.GuestSide;
import com.yourcompany.wedding.weddingbackend.model.RsvpStatus;
import lombok.*;
import org.openapitools.jackson.nullable.JsonNullable; // NEW IMPORT

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GuestDto {
    private Long id;
    private String name; // Name is assumed always present if intended to update or create
    private JsonNullable<RsvpStatus> rsvpStatus = JsonNullable.undefined(); // Default to undefined
    private JsonNullable<GuestSide> side = JsonNullable.undefined();       // Default to undefined
    private JsonNullable<GuestRole> role = JsonNullable.undefined();       // Default to undefined
    private JsonNullable<Integer> tableNumber = JsonNullable.undefined();   // Default to undefined
    private JsonNullable<String> mealPlan = JsonNullable.undefined();     // Default to undefined
    private JsonNullable<String> comments = JsonNullable.undefined();     // Default to undefined
}