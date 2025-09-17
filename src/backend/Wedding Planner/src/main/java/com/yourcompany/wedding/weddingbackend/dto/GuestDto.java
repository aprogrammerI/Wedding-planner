// File: src/main/java/com/yourcompany/wedding/weddingbackend/dto/GuestDto.java
package com.yourcompany.wedding.weddingbackend.dto;

import com.yourcompany.wedding.weddingbackend.model.GuestRole;
import com.yourcompany.wedding.weddingbackend.model.GuestSide;
import com.yourcompany.wedding.weddingbackend.model.RsvpStatus;
import lombok.*;
import org.openapitools.jackson.nullable.JsonNullable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GuestDto {
    private Long id;
    private String name;
    @Builder.Default
    private JsonNullable<RsvpStatus> rsvpStatus = JsonNullable.undefined();
    @Builder.Default
    private JsonNullable<GuestSide> side = JsonNullable.undefined();
    @Builder.Default
    private JsonNullable<GuestRole> role = JsonNullable.undefined();
    @Builder.Default
    private JsonNullable<Integer> tableNumber = JsonNullable.undefined();
    @Builder.Default
    private JsonNullable<String> mealPlan = JsonNullable.undefined();
    @Builder.Default
    private JsonNullable<String> comments = JsonNullable.undefined();

}