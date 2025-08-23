package com.yourcompany.wedding.weddingbackend.service;

import com.yourcompany.wedding.weddingbackend.dto.BudgetDTO;
import com.yourcompany.wedding.weddingbackend.dto.BudgetItemDTO;
import com.yourcompany.wedding.weddingbackend.model.Budget;
import com.yourcompany.wedding.weddingbackend.model.BudgetItem;
import com.yourcompany.wedding.weddingbackend.model.CategoryType;
import com.yourcompany.wedding.weddingbackend.dto.BudgetCategoryDTO;

public interface BudgetService {
    BudgetDTO getBudget(Long budgetId);
    BudgetDTO createBudget(Budget budget);
    BudgetDTO updateBudget(Long budgetId, Budget updatedBudget);

    BudgetItemDTO addBudgetItem(Long budgetId, BudgetItem budgetItem);
    BudgetItemDTO updateBudgetItem(Long budgetId, Long itemId, BudgetItem updatedItem);
    void deleteBudgetItem(Long budgetId, Long itemId);

    BudgetCategoryDTO updateBudgetCategoryLimit(Long budgetId, CategoryType categoryType, double newLimit);
}
