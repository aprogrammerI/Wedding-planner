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
    public BudgetDTO getBudget(Long userId) {
        Optional<Budget> opt = budgetRepo.findByOwnerId(userId);
        if (opt.isEmpty()) {
            return BudgetDTO.builder()
                    .totalBudget(0.0)
                    .remaining(0.0)
                    .totalSpent(0.0)
                    .itemDTOs(List.of())
                    .allCategoryDTOs(Arrays.stream(CategoryType.values())
                            .map(ct -> new BudgetCategoryDTO(ct, 0.0, 0.0, "", 0.0))
                            .toList())
                    .build();
        }

        Budget budget = opt.get();

        // Load children via separate queries (avoid multiple-bag fetch issue)
        List<BudgetItem> items = budgetItemRepo.findByBudget(budget);
        List<BudgetCategory> categories = budgetCategoryRepo.findByBudget(budget);

        double totalSpent = items.stream().mapToDouble(BudgetItem::getAmount).sum();
        double remaining = budget.getTotalBudget() - totalSpent;

        Map<CategoryType, Double> spentByCategory = items.stream()
                .collect(Collectors.groupingBy(BudgetItem::getCategoryType, Collectors.summingDouble(BudgetItem::getAmount)));

        List<BudgetItemDTO> itemDTOs = items.stream()
                .map(this::mapToBudgetItemDTO)
                .toList();

        List<BudgetCategoryDTO> categoryDTOs = categories.stream()
                .map(bc -> {
                    double spent = spentByCategory.getOrDefault(bc.getCategoryType(), 0.0);
                    String status = bc.getCategoryLimit() <= 0.0 ? "" : (spent > bc.getCategoryLimit() ? "OVER" : "OK");
                    double percentage = (bc.getCategoryLimit() > 0) ? (spent / bc.getCategoryLimit()) * 100 : 0.0;
                    return new BudgetCategoryDTO(bc.getCategoryType(), spent, bc.getCategoryLimit(), status, percentage);
                })
                .toList();

        // Ensure all categories are present
        List<BudgetCategoryDTO> allCategoryDTOs = Arrays.stream(CategoryType.values())
                .map(ct -> categoryDTOs.stream().filter(d -> d.getCategoryType() == ct).findFirst()
                        .orElseGet(() -> {
                            double spent = spentByCategory.getOrDefault(ct, 0.0);
                            double limit = categories.stream()
                                    .filter(bc -> bc.getCategoryType() == ct)
                                    .mapToDouble(BudgetCategory::getCategoryLimit)
                                    .findFirst()
                                    .orElse(0.0);
                            String status = limit <= 0.0 ? "" : (spent > limit ? "OVER" : "OK");
                            double percentage = (limit > 0) ? (spent / limit) * 100 : 0.0;
                            return new BudgetCategoryDTO(ct, spent, limit, status, percentage);
                        }))
                .sorted((a, b) -> a.getCategoryType().name().compareTo(b.getCategoryType().name()))
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

    @Override
    @Transactional
    public BudgetDTO createOrUpdateBudget(Long userId, BudgetDTO budgetDto) {
        Budget budget = budgetRepo.findByOwnerId(userId)
                .orElseGet(() -> initializeBudgetSkeleton(userId));

        if (budgetDto.getTotalBudget() != null) {
            budget.setTotalBudget(budgetDto.getTotalBudget());
        }

        budgetRepo.save(budget);
        // Return fully computed aggregate after save
        return getBudget(userId);
    }

    @Override
    @Transactional
    public BudgetItemDTO addBudgetItem(Long userId, BudgetItemDTO budgetItemDto) {
        Budget budget = budgetRepo.findByOwnerId(userId)
                .orElseGet(() -> initializeBudgetSkeleton(userId));

        budget = budgetRepo.save(budget);

        BudgetItem budgetItem = BudgetItem.builder()
                .itemName(budgetItemDto.getItemName())
                .amount(budgetItemDto.getAmount())
                .categoryType(budgetItemDto.getCategoryType())
                .budget(budget)
                .build();

        return mapToBudgetItemDTO(budgetItemRepo.save(budgetItem));
    }

    @Override
    @Transactional
    public BudgetItemDTO updateBudgetItem(Long userId, Long itemId, BudgetItemDTO updatedItemDto) {
        BudgetItem existingItem = budgetItemRepo.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Budget item not found"));

        if (!existingItem.getBudget().getOwnerId().equals(userId)) {
            throw new RuntimeException("Forbidden");
        }

        if (updatedItemDto.getItemName() != null) {
            existingItem.setItemName(updatedItemDto.getItemName());
        }
        if (updatedItemDto.getAmount() != null) {
            existingItem.setAmount(updatedItemDto.getAmount());
        }
        if (updatedItemDto.getCategoryType() != null) {
            existingItem.setCategoryType(updatedItemDto.getCategoryType());
        }

        return mapToBudgetItemDTO(budgetItemRepo.save(existingItem));
    }

    @Override
    @Transactional
    public void deleteBudgetItem(Long userId, Long itemId) {
        BudgetItem existingItem = budgetItemRepo.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Budget item not found"));

        if (!existingItem.getBudget().getOwnerId().equals(userId)) {
            throw new RuntimeException("Forbidden");
        }

        budgetItemRepo.delete(existingItem);
    }

    @Override
    @Transactional
    public BudgetCategoryDTO updateBudgetCategoryLimit(Long userId, CategoryType categoryType, double newLimit) {
        Budget budget = budgetRepo.findByOwnerId(userId)
                .orElseGet(() -> initializeBudgetSkeleton(userId));

        budget = budgetRepo.save(budget);

        final Budget finalBudget = budget;
        BudgetCategory budgetCategory = budgetCategoryRepo.findByBudgetAndCategoryType(finalBudget, categoryType)
                .orElseGet(() -> {
                    BudgetCategory newCategory = BudgetCategory.builder()
                            .budget(finalBudget)
                            .categoryType(categoryType)
                            .categoryLimit(0.0)
                            .build();
                    finalBudget.getBudgetCategories().add(newCategory);
                    return newCategory;
                });

        budgetCategory.setCategoryLimit(newLimit);
        BudgetCategory savedCategory = budgetCategoryRepo.save(budgetCategory);

        double spent = budgetItemRepo.findByBudgetAndCategoryType(finalBudget, savedCategory.getCategoryType()).stream()
                .mapToDouble(BudgetItem::getAmount)
                .sum();

        String status = savedCategory.getCategoryLimit() <= 0.0 ? "" : (spent > savedCategory.getCategoryLimit() ? "OVER" : "OK");
        double percentage = (savedCategory.getCategoryLimit() > 0) ? (spent / savedCategory.getCategoryLimit()) * 100 : 0.0;

        return new BudgetCategoryDTO(savedCategory.getCategoryType(), spent, savedCategory.getCategoryLimit(), status, percentage);
    }

    /* ----------------- Helpers ----------------- */

    private Budget initializeBudgetSkeleton(Long userId) {
        Budget newBudget = Budget.builder()
                .ownerId(userId)
                .totalBudget(0.0)
                .build();

        Arrays.stream(CategoryType.values()).forEach(categoryType -> {
            BudgetCategory budgetCategory = BudgetCategory.builder()
                    .categoryType(categoryType)
                    .categoryLimit(0.0)
                    .budget(newBudget)
                    .build();
            newBudget.getBudgetCategories().add(budgetCategory);
        });

        return newBudget;
    }

    private BudgetItemDTO mapToBudgetItemDTO(BudgetItem budgetItem) {
        return new BudgetItemDTO(
                budgetItem.getId(),
                budgetItem.getItemName(),
                budgetItem.getAmount(),
                budgetItem.getCategoryType()
        );
    }
}