package com.yourcompany.wedding.weddingbackend.service;

import com.yourcompany.wedding.weddingbackend.dto.BudgetDTO;
import com.yourcompany.wedding.weddingbackend.dto.BudgetItemDTO;
import com.yourcompany.wedding.weddingbackend.dto.BudgetCategoryDTO;
import com.yourcompany.wedding.weddingbackend.model.BudgetItem;
import com.yourcompany.wedding.weddingbackend.model.CategoryType;

public interface BudgetService {
    BudgetDTO getBudget();
    BudgetDTO createOrUpdateBudget(BudgetDTO budgetDto);

    BudgetItemDTO addBudgetItem(BudgetItemDTO budgetItemDto);
    BudgetItemDTO updateBudgetItem(Long itemId, BudgetItemDTO updatedItemDto);
    void deleteBudgetItem(Long itemId);

    BudgetCategoryDTO updateBudgetCategoryLimit(CategoryType categoryType, double newLimit);
}
