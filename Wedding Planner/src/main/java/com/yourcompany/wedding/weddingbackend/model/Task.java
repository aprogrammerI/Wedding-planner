package com.yourcompany.wedding.weddingbackend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Per-user ownership
    @Column(nullable = false)
    private Long ownerId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String description;

    @Builder.Default
    private LocalDate dueDate = null;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Priority priority = Priority.MEDIUM;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Assignee assignee = Assignee.OTHER;

    @Builder.Default
    private boolean completed = false;

    @Builder.Default
    private boolean reminderEnabled = false;

    // Subtasks: cascade saves/deletes; orphanRemoval auto-deletes removed subtasks
    @Builder.Default
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Subtask> subtasks = new ArrayList<>();
}