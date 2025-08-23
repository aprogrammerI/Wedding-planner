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

    @Enumerated(EnumType.STRING) // Store enum as string in DB
    private RsvpStatus rsvpStatus = RsvpStatus.PENDING; // New field for RSVP status, default to PENDING

    @Enumerated(EnumType.STRING) // Store enum as string in DB
    private GuestSide side; // New field for Guest side (Bride/Groom)

    @Enumerated(EnumType.STRING) // Store enum as string in DB
    private GuestRole role; // New field for Guest role

    private Integer tableNumber; // New field for table number

    private String mealPlan; // New field for meal plan

    private String comments; // New field for comments

    // wedding field removed as per your instruction
}