package com.yourcompany.wedding.weddingbackend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class BudgetCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private CategoryType categoryType;

    private double categoryLimit;

    @ManyToOne
    @JoinColumn(name = "budget_id", nullable = false)
    private Budget budget;
}
