package com.yourcompany.wedding.weddingbackend.service.impl;

import com.yourcompany.wedding.weddingbackend.dto.BudgetCategoryDTO;
import com.yourcompany.wedding.weddingbackend.dto.BudgetDTO;
import com.yourcompany.wedding.weddingbackend.dto.BudgetItemDTO;
import com.yourcompany.wedding.weddingbackend.model.Budget;
import com.yourcompany.wedding.weddingbackend.model.BudgetCategory;
import com.yourcompany.wedding.weddingbackend.model.BudgetItem;
import com.yourcompany.wedding.weddingbackend.model.CategoryType;
import com.yourcompany.wedding.weddingbackend.repository.BudgetCategoryRepository;
import com.yourcompany.wedding.weddingbackend.repository.BudgetItemRepository;
import com.yourcompany.wedding.weddingbackend.repository.BudgetRepository;
import com.yourcompany.wedding.weddingbackend.service.BudgetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BudgetServiceImpl implements BudgetService {

    private final BudgetRepository budgetRepo;
    private final BudgetItemRepository budgetItemRepo;
    private final BudgetCategoryRepository budgetCategoryRepo;

    @Override
    public BudgetDTO getBudget(Long budgetId) {
        Budget budget = budgetRepo.findById(budgetId)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        return mapToDTO(budget);
    }

    @Override
    public BudgetDTO createBudget(Budget budget) {
        // Initialize default categories if not provided
        if (budget.getBudgetCategories().isEmpty()) {
            Arrays.stream(CategoryType.values()).forEach(categoryType -> {
                BudgetCategory budgetCategory = new BudgetCategory();
                budgetCategory.setCategoryType(categoryType);
                budgetCategory.setCategoryLimit(0.0);
                budgetCategory.setBudget(budget);
                budget.getBudgetCategories().add(budgetCategory);
            });
        }
        Budget savedBudget = budgetRepo.save(budget);
        return mapToDTO(savedBudget);
    }

    @Override
    public BudgetDTO updateBudget(Long budgetId, Budget updatedBudget) {
        Budget existingBudget = budgetRepo.findById(budgetId)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        existingBudget.setTotalBudget(updatedBudget.getTotalBudget());
        // Handle updating categories and items if needed, or rely on their dedicated endpoints
        return mapToDTO(budgetRepo.save(existingBudget));
    }

    @Override
    public BudgetItemDTO addBudgetItem(Long budgetId, BudgetItem budgetItem) {
        Budget budget = budgetRepo.findById(budgetId)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        budgetItem.setBudget(budget);
        BudgetItem savedItem = budgetItemRepo.save(budgetItem);
        return mapToDTO(savedItem);
    }

    @Override
    public BudgetItemDTO updateBudgetItem(Long budgetId, Long itemId, BudgetItem updatedItem) {
        BudgetItem existingItem = budgetItemRepo.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Budget item not found"));
        if (!existingItem.getBudget().getId().equals(budgetId)) {
            throw new RuntimeException("Budget item does not belong to the given budget");
        }
        existingItem.setItemName(updatedItem.getItemName());
        existingItem.setAmount(updatedItem.getAmount());
        existingItem.setCategoryType(updatedItem.getCategoryType());
        return mapToDTO(budgetItemRepo.save(existingItem));
    }

    @Override
    public void deleteBudgetItem(Long budgetId, Long itemId) {
        BudgetItem existingItem = budgetItemRepo.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Budget item not found"));
        if (!existingItem.getBudget().getId().equals(budgetId)) {
            throw new RuntimeException("Budget item does not belong to the given budget");
        }
        budgetItemRepo.delete(existingItem);
    }

    @Override
    public BudgetCategoryDTO updateBudgetCategoryLimit(Long budgetId, CategoryType categoryType, double newLimit) {
        BudgetCategory budgetCategory = budgetCategoryRepo.findByBudgetIdAndCategoryType(budgetId, categoryType)
                .orElseGet(() -> {
                    Budget budget = budgetRepo.findById(budgetId)
                            .orElseThrow(() -> new RuntimeException("Budget not found"));
                    BudgetCategory newCategory = new BudgetCategory();
                    newCategory.setBudget(budget);
                    newCategory.setCategoryType(categoryType);
                    return newCategory;
                });
        budgetCategory.setCategoryLimit(newLimit);
        BudgetCategory savedCategory = budgetCategoryRepo.save(budgetCategory);

        // Recalculate spent and status for the updated category
        double spent = budgetItemRepo.findByBudgetId(budgetId).stream()
                .filter(item -> item.getCategoryType() == savedCategory.getCategoryType())
                .mapToDouble(BudgetItem::getAmount)
                .sum();
        String status = savedCategory.getCategoryLimit() <= 0.0 ? "" : (spent > savedCategory.getCategoryLimit() ? "OVER" : "OK");

        // Calculate total spent across all items to determine individual category percentages
        double totalSpentAcrossAllItems = budgetItemRepo.findByBudgetId(budgetId).stream()
                .mapToDouble(BudgetItem::getAmount)
                .sum();
        double percentage = (totalSpentAcrossAllItems > 0) ? (spent / totalSpentAcrossAllItems) * 100 : 0.0;

        return new BudgetCategoryDTO(savedCategory.getCategoryType(), spent, savedCategory.getCategoryLimit(), status, percentage);
    }

    private BudgetDTO mapToDTO(Budget budget) {
        double totalSpent = budget.getBudgetItems().stream()
                .mapToDouble(BudgetItem::getAmount)
                .sum();
        double remaining = budget.getTotalBudget() - totalSpent;

        List<BudgetItemDTO> itemDTOs = budget.getBudgetItems().stream()
                .map(this::mapToDTO)
                .toList();

        Map<CategoryType, Double> spentByCategory = budget.getBudgetItems().stream()
                .collect(Collectors.groupingBy(BudgetItem::getCategoryType, Collectors.summingDouble(BudgetItem::getAmount)));

        List<BudgetCategoryDTO> categoryDTOs = budget.getBudgetCategories().stream()
                .map(bc -> {
                    double spent = spentByCategory.getOrDefault(bc.getCategoryType(), 0.0);
                    String status = bc.getCategoryLimit() <= 0.0 ? "" : (spent > bc.getCategoryLimit() ? "OVER" : "OK");
                    double percentage = (totalSpent > 0) ? (spent / totalSpent) * 100 : 0.0;
                    return new BudgetCategoryDTO(bc.getCategoryType(), spent, bc.getCategoryLimit(), status, percentage);
                })
                .toList();

        // Ensure all CategoryTypes are present in categoryDTOs, even if no items or limits set
        List<BudgetCategoryDTO> allCategoryDTOs = Arrays.stream(CategoryType.values())
                .map(ct -> {
                    Optional<BudgetCategoryDTO> existing = categoryDTOs.stream()
                            .filter(dto -> dto.categoryType() == ct)
                            .findFirst();
                    if (existing.isPresent()) {
                        return existing.get();
                    } else {
                        double spent = spentByCategory.getOrDefault(ct, 0.0);
                        // Attempt to find a default limit from budgetCategories if not explicitly set for this categoryType
                        double limit = budget.getBudgetCategories().stream()
                                .filter(bc -> bc.getCategoryType() == ct)
                                .mapToDouble(BudgetCategory::getCategoryLimit)
                                .findFirst()
                                .orElse(0.0); // Default to 0 if no limit found
                        String status = limit <= 0.0 ? "" : (spent > limit ? "OVER" : "OK");
                        double percentage = (totalSpent > 0) ? (spent / totalSpent) * 100 : 0.0;
                        return new BudgetCategoryDTO(ct, spent, limit, status, percentage);
                    }
                })
                .sorted((dto1, dto2) -> dto1.categoryType().name().compareTo(dto2.categoryType().name())) // Sort by category name
                .toList();

        return new BudgetDTO(
                budget.getId(),
                budget.getTotalBudget(),
                remaining,
                totalSpent, // <--- Add this line
                itemDTOs,
                allCategoryDTOs
        );
    }

    private BudgetItemDTO mapToDTO(BudgetItem budgetItem) {
        return new BudgetItemDTO(
                budgetItem.getId(),
                budgetItem.getItemName(),
                budgetItem.getAmount(),
                budgetItem.getCategoryType()
        );
    }
}
