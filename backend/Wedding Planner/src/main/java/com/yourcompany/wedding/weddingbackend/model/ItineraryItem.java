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

    // Per-user ownership
    @Column(nullable = false)
    private Long ownerId;

    private LocalTime time;
    private String eventName;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String description;
}