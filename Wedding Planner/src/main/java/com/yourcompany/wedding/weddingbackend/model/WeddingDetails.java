package com.yourcompany.wedding.weddingbackend.model;

import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "wedding_details")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeddingDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Per-user ownership
    @Column(nullable = false)
    private Long ownerId;

    private String brideFirstName;
    private String brideLastName;
    private Integer brideAge;

    private String groomFirstName;
    private String groomLastName;
    private Integer groomAge;

    private LocalDate weddingDate;
    private String weddingLocation;
}