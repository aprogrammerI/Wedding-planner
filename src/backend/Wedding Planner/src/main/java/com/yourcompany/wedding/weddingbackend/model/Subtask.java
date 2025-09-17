package com.yourcompany.wedding.weddingbackend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Subtask {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private boolean completed = false;

    @ManyToOne
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;
}
