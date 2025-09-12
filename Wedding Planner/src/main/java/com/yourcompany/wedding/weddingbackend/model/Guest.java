package com.yourcompany.wedding.weddingbackend.model;

import lombok.*;
import jakarta.persistence.*;

@Entity
@Table(name = "guests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Guest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Builder.Default // Added @Builder.Default
    @Enumerated(EnumType.STRING) // Store enum as string in DB
    private RsvpStatus rsvpStatus = RsvpStatus.PENDING; 

    @Builder.Default // Added @Builder.Default
    @Enumerated(EnumType.STRING) // Store enum as string in DB
    private GuestSide side = null; // Assuming null is default for side if not specified

    @Builder.Default // Added @Builder.Default
    @Enumerated(EnumType.STRING) // Store enum as string in DB
    private GuestRole role = null; // Assuming null is default for role if not specified

    @Builder.Default // Added @Builder.Default
    private Integer tableNumber = null; 

    @Builder.Default // Added @Builder.Default
    private String mealPlan = null;     

    @Builder.Default // Added @Builder.Default
    @Column(columnDefinition = "TEXT")
    private String comments = null;     
}