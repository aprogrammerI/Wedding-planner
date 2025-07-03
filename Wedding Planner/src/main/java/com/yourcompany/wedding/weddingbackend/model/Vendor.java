package com.yourcompany.wedding.weddingbackend.model;

import lombok.*;
import jakarta.persistence.*;

@Entity
@Table(name = "vendors")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vendor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String serviceType;
    private String contactInfo;

    @ManyToOne
    @JoinColumn(name = "wedding_id")
    private Wedding wedding;
}

