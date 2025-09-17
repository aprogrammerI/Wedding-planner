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

    // Per-user ownership
    @Column(nullable = false)
    private Long ownerId;

    @Column(nullable = false)
    private String name;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private RsvpStatus rsvpStatus = RsvpStatus.PENDING;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private GuestSide side = null;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private GuestRole role = null;

    @Builder.Default
    private Integer tableNumber = null;

    @Builder.Default
    private String mealPlan = null;

    @Builder.Default
    @Column(columnDefinition = "TEXT")
    private String comments = null;
}