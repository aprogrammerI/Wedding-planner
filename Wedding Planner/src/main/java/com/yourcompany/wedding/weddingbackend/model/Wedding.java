package com.yourcompany.wedding.weddingbackend.model;

import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "weddings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Wedding {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private LocalDate date;
    private String location;
    private String description;

    @ManyToOne
    @JoinColumn(name = "planner_id")
    private User planner;
}