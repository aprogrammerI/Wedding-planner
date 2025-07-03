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

    private boolean rsvp;
    private String dietaryPreferences;

    @ManyToOne
    @JoinColumn(name = "wedding_id")
    private Wedding wedding;
}
