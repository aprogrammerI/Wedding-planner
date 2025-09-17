package com.yourcompany.wedding.weddingbackend.service;

import com.yourcompany.wedding.weddingbackend.dto.BudgetDTO;
import com.yourcompany.wedding.weddingbackend.dto.BudgetItemDTO;
import com.yourcompany.wedding.weddingbackend.dto.BudgetCategoryDTO;
import com.yourcompany.wedding.weddingbackend.model.CategoryType;

public interface BudgetService {
    BudgetDTO getBudget(Long userId);
    BudgetDTO createOrUpdateBudget(Long userId, BudgetDTO budgetDto);
    BudgetItemDTO addBudgetItem(Long userId, BudgetItemDTO budgetItemDto);
    BudgetItemDTO updateBudgetItem(Long userId, Long itemId, BudgetItemDTO updatedItemDto);
    void deleteBudgetItem(Long userId, Long itemId);
    BudgetCategoryDTO updateBudgetCategoryLimit(Long userId, CategoryType categoryType, double newLimit);
}