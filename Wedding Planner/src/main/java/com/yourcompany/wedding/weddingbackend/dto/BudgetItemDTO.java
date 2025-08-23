package com.yourcompany.wedding.weddingbackend.dto;

import com.yourcompany.wedding.weddingbackend.model.CategoryType;

public record BudgetItemDTO(
        Long id,
        String itemName,
        double amount,
        CategoryType categoryType
) {}
