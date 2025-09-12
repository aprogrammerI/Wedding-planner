package com.yourcompany.wedding.weddingbackend.web;

import com.yourcompany.wedding.weddingbackend.dto.BudgetCategoryDTO;
import com.yourcompany.wedding.weddingbackend.dto.BudgetDTO;
import com.yourcompany.wedding.weddingbackend.dto.BudgetItemDTO;
import com.yourcompany.wedding.weddingbackend.model.CategoryType;
import com.yourcompany.wedding.weddingbackend.service.BudgetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/budget") // Changed to global mapping
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    @GetMapping
    public ResponseEntity<BudgetDTO> getBudget() {
        return ResponseEntity.ok(budgetService.getBudget());
    }

    @PutMapping
    public ResponseEntity<BudgetDTO> createOrUpdateBudget(@RequestBody BudgetDTO budgetDto) {
        try {
            BudgetDTO savedBudget = budgetService.createOrUpdateBudget(budgetDto);
            return ResponseEntity.ok(savedBudget);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/items")
    public ResponseEntity<BudgetItemDTO> addBudgetItem(@RequestBody BudgetItemDTO budgetItemDto) {
        try {
            BudgetItemDTO newItem = budgetService.addBudgetItem(budgetItemDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(newItem);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<BudgetItemDTO> updateBudgetItem(@PathVariable Long itemId, @RequestBody BudgetItemDTO updatedItemDto) {
        try {
            BudgetItemDTO updatedItem = budgetService.updateBudgetItem(itemId, updatedItemDto);
            return ResponseEntity.ok(updatedItem);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Void> deleteBudgetItem(@PathVariable Long itemId) {
        try {
            budgetService.deleteBudgetItem(itemId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PatchMapping("/categories/{categoryType}/limit")
    public ResponseEntity<BudgetCategoryDTO> updateBudgetCategoryLimit(@PathVariable CategoryType categoryType, @RequestParam double newLimit) {
        try {
            BudgetCategoryDTO updatedCategory = budgetService.updateBudgetCategoryLimit(categoryType, newLimit);
            return ResponseEntity.ok(updatedCategory);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}
