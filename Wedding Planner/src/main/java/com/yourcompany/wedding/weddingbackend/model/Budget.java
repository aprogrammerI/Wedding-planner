package com.yourcompany.wedding.weddingbackend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
public class Budget {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double totalBudget;

    @OneToMany(mappedBy = "budget", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<BudgetItem> budgetItems = new ArrayList<>();

    @OneToMany(mappedBy = "budget", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<BudgetCategory> budgetCategories = new ArrayList<>();
}
