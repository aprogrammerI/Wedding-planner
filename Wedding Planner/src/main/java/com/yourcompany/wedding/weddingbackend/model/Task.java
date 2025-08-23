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

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String description;

    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Priority priority = Priority.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Assignee assignee = Assignee.OTHER;

    private boolean completed = false;

    private boolean reminderEnabled = false;

    // Subtasks: cascade so saves/deletes propagate; orphanRemoval to auto-delete removed subtasks
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Subtask> subtasks = new ArrayList<>();
}
