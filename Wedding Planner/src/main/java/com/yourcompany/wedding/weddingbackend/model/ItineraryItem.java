package com.yourcompany.wedding.weddingbackend.model;

import lombok.*;
import jakarta.persistence.*;
import java.time.LocalTime;

@Entity
@Table(name = "itinerary_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItineraryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalTime time;
    private String eventName;
    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String description;
    
    // Removed @ManyToOne Wedding wedding; field as it's no longer needed for a global scope
}