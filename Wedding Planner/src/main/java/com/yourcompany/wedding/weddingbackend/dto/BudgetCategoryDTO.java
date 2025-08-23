package com.yourcompany.wedding.weddingbackend.dto;

import com.yourcompany.wedding.weddingbackend.model.CategoryType;

public record BudgetCategoryDTO(
        CategoryType categoryType,
        double spent,
        double limit,
        String status,
        double percentage
) {}
