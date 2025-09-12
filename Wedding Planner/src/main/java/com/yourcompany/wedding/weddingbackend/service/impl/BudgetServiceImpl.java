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
import jakarta.transaction.Transactional;
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
    public BudgetDTO getBudget() {
        return budgetRepo.findTopByOrderByIdAsc()
                .map(this::mapToDTO)
                .orElseGet(() -> {
                    return BudgetDTO.builder()
                            .totalBudget(0.0)
                            .remaining(0.0)
                            .totalSpent(0.0)
                            .itemDTOs(List.of())
                            .allCategoryDTOs(Arrays.stream(CategoryType.values())
                                    .map(ct -> new BudgetCategoryDTO(ct, 0.0, 0.0, "", 0.0))
                                    .collect(Collectors.toList()))
                            .build();
                });
    }

    @Override
    @Transactional
    public BudgetDTO createOrUpdateBudget(BudgetDTO budgetDto) {
        Budget budget = budgetRepo.findTopByOrderByIdAsc()
                .orElseGet(() -> {
                    Budget newBudget = Budget.builder().totalBudget(0.0).build();
                    Arrays.stream(CategoryType.values()).forEach(categoryType -> {
                        BudgetCategory budgetCategory = BudgetCategory.builder()
                                .categoryType(categoryType)
                                .categoryLimit(0.0)
                                .budget(newBudget)
                                .build();
                        newBudget.getBudgetCategories().add(budgetCategory);
                    });
                    return newBudget;
                });

        if (budgetDto.getTotalBudget() != null) {
            budget.setTotalBudget(budgetDto.getTotalBudget());
        }

        Budget savedBudget = budgetRepo.save(budget);
        return mapToDTO(savedBudget);
    }

    @Override
    @Transactional
    public BudgetItemDTO addBudgetItem(BudgetItemDTO budgetItemDto) {
        Budget budget = budgetRepo.findTopByOrderByIdAsc()
                .orElseThrow(() -> new RuntimeException("No budget exists. Please create one first."));

        BudgetItem budgetItem = BudgetItem.builder()
                .itemName(budgetItemDto.getItemName())
                .amount(budgetItemDto.getAmount())
                .categoryType(budgetItemDto.getCategoryType())
                .budget(budget)
                .build();
        BudgetItem savedItem = budgetItemRepo.save(budgetItem);
        return mapToDTO(savedItem);
    }

    @Override
    @Transactional
    public BudgetItemDTO updateBudgetItem(Long itemId, BudgetItemDTO updatedItemDto) {
        BudgetItem existingItem = budgetItemRepo.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Budget item not found"));

        if (updatedItemDto.getItemName() != null) {
            existingItem.setItemName(updatedItemDto.getItemName());
        }
        if (updatedItemDto.getAmount() != null) {
            existingItem.setAmount(updatedItemDto.getAmount());
        }
        if (updatedItemDto.getCategoryType() != null) {
            existingItem.setCategoryType(updatedItemDto.getCategoryType());
        }

        return mapToDTO(budgetItemRepo.save(existingItem));
    }

    @Override
    @Transactional
    public void deleteBudgetItem(Long itemId) {
        BudgetItem existingItem = budgetItemRepo.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Budget item not found"));
        budgetItemRepo.delete(existingItem);
    }

    @Override
    @Transactional
    public BudgetCategoryDTO updateBudgetCategoryLimit(CategoryType categoryType, double newLimit) {
        Budget budget = budgetRepo.findTopByOrderByIdAsc()
                .orElseThrow(() -> new RuntimeException("No budget exists. Please create one first."));

        BudgetCategory budgetCategory = budgetCategoryRepo.findByBudgetAndCategoryType(budget, categoryType)
                .orElseGet(() -> {
                    BudgetCategory newCategory = BudgetCategory.builder()
                            .budget(budget)
                            .categoryType(categoryType)
                            .categoryLimit(0.0)
                            .build();
                    budget.getBudgetCategories().add(newCategory);
                    return newCategory;
                });
        budgetCategory.setCategoryLimit(newLimit);
        BudgetCategory savedCategory = budgetCategoryRepo.save(budgetCategory);

        double spent = budgetItemRepo.findByBudgetAndCategoryType(budget, savedCategory.getCategoryType()).stream()
                .mapToDouble(BudgetItem::getAmount)
                .sum();
        String status = savedCategory.getCategoryLimit() <= 0.0 ? "" : (spent > savedCategory.getCategoryLimit() ? "OVER" : "OK");

        double percentage = (savedCategory.getCategoryLimit() > 0) ? (spent / savedCategory.getCategoryLimit()) * 100 : 0.0;

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
                    double percentage = (bc.getCategoryLimit() > 0) ? (spent / bc.getCategoryLimit()) * 100 : 0.0;
                    return new BudgetCategoryDTO(bc.getCategoryType(), spent, bc.getCategoryLimit(), status, percentage);
                })
                .toList();

        List<BudgetCategoryDTO> allCategoryDTOs = Arrays.stream(CategoryType.values())
                .map(ct -> {
                    Optional<BudgetCategoryDTO> existing = categoryDTOs.stream()
                            .filter(dto -> dto.getCategoryType() == ct)
                            .findFirst();
                    if (existing.isPresent()) {
                        return existing.get();
                    } else {
                        double spent = spentByCategory.getOrDefault(ct, 0.0);
                        double limit = budget.getBudgetCategories().stream()
                                .filter(bc -> bc.getCategoryType() == ct)
                                .mapToDouble(BudgetCategory::getCategoryLimit)
                                .findFirst()
                                .orElse(0.0);
                        String status = limit <= 0.0 ? "" : (spent > limit ? "OVER" : "OK");
                        double percentage = (limit > 0) ? (spent / limit) * 100 : 0.0;
                        return new BudgetCategoryDTO(ct, spent, limit, status, percentage);
                    }
                })
                .sorted((dto1, dto2) -> dto1.getCategoryType().name().compareTo(dto2.getCategoryType().name()))
                .toList();

        return new BudgetDTO(
                budget.getId(),
                budget.getTotalBudget(),
                remaining,
                totalSpent,
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
