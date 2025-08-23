package com.yourcompany.wedding.weddingbackend.repository;

import com.yourcompany.wedding.weddingbackend.model.BudgetCategory;
import com.yourcompany.wedding.weddingbackend.model.CategoryType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BudgetCategoryRepository extends JpaRepository<BudgetCategory, Long> {
    List<BudgetCategory> findByBudgetId(Long budgetId);
    Optional<BudgetCategory> findByBudgetIdAndCategoryType(Long budgetId, CategoryType categoryType);
}
