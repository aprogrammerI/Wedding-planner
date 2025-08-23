package com.yourcompany.wedding.weddingbackend.web;

import com.yourcompany.wedding.weddingbackend.dto.BudgetCategoryDTO;
import com.yourcompany.wedding.weddingbackend.dto.BudgetDTO;
import com.yourcompany.wedding.weddingbackend.dto.BudgetItemDTO;
import com.yourcompany.wedding.weddingbackend.model.Budget;
import com.yourcompany.wedding.weddingbackend.model.BudgetItem;
import com.yourcompany.wedding.weddingbackend.model.CategoryType;
import com.yourcompany.wedding.weddingbackend.service.BudgetService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    @GetMapping("/{budgetId}")
    public BudgetDTO getBudget(@PathVariable Long budgetId) {
        return budgetService.getBudget(budgetId);
    }

    @PostMapping
    public BudgetDTO createBudget(@RequestBody Budget budget) {
        return budgetService.createBudget(budget);
    }

    @PutMapping("/{budgetId}")
    public BudgetDTO updateBudget(@PathVariable Long budgetId, @RequestBody Budget updatedBudget) {
        return budgetService.updateBudget(budgetId, updatedBudget);
    }

    @PostMapping("/{budgetId}/items")
    public BudgetItemDTO addBudgetItem(@PathVariable Long budgetId, @RequestBody BudgetItem budgetItem) {
        return budgetService.addBudgetItem(budgetId, budgetItem);
    }

    @PutMapping("/{budgetId}/items/{itemId}")
    public BudgetItemDTO updateBudgetItem(@PathVariable Long budgetId, @PathVariable Long itemId, @RequestBody BudgetItem updatedItem) {
        return budgetService.updateBudgetItem(budgetId, itemId, updatedItem);
    }

    @DeleteMapping("/{budgetId}/items/{itemId}")
    public void deleteBudgetItem(@PathVariable Long budgetId, @PathVariable Long itemId) {
        budgetService.deleteBudgetItem(budgetId, itemId);
    }

    @PatchMapping("/{budgetId}/categories/{categoryType}/limit")
    public BudgetCategoryDTO updateBudgetCategoryLimit(@PathVariable Long budgetId, @PathVariable CategoryType categoryType, @RequestParam double newLimit) {
        return budgetService.updateBudgetCategoryLimit(budgetId, categoryType, newLimit);
    }
}
