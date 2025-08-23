package com.yourcompany.wedding.weddingbackend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class BudgetItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String itemName;
    private double amount;

    @Enumerated(EnumType.STRING)
    private CategoryType categoryType;

    @ManyToOne
    @JoinColumn(name = "budget_id", nullable = false)
    private Budget budget;
}
