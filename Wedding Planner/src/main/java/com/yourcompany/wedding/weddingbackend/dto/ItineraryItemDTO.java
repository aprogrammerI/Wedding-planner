
package com.yourcompany.wedding.weddingbackend.dto;

import lombok.*;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItineraryItemDTO {
    private Long id;
    private LocalTime time;
    private String eventName;
    private String description;
    // Removed weddingId field as it's no longer needed for a global scope
}
