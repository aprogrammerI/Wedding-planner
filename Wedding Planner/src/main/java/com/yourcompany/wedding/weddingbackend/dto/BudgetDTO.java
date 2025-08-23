package com.yourcompany.wedding.weddingbackend.dto;

import java.util.List;

public record BudgetDTO(
        Long id,
        double totalBudget,
        double remaining,
        double totalSpentOverall,
        List<BudgetItemDTO> budgetItems,
        List<BudgetCategoryDTO> budgetCategories
) {}
