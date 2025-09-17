package com.yourcompany.wedding.weddingbackend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "vendors")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Vendor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false)
    private Long ownerId;

    @Column(nullable = false)      private String name;
    @Column(nullable = false)      private String category;
    @Column(nullable = false)      private String phone;
    @Column(nullable = false)      private String email;
    @Column(nullable = true)       private String website;

    /**
     * Unidirectional Many-to-Many from Vendor -> Task.
     * Join table: vendor_tasks(vendor_id, task_id)
     */
    @ManyToMany
    @JoinTable(
            name = "vendor_tasks",
            joinColumns = @JoinColumn(name = "vendor_id"),
            inverseJoinColumns = @JoinColumn(name = "task_id")
    )
    @Builder.Default
    private Set<Task> assignedTasks = new HashSet<>();
}