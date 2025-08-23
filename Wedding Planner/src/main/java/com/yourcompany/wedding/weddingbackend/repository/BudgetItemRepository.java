package com.yourcompany.wedding.weddingbackend.repository;

import com.yourcompany.wedding.weddingbackend.model.BudgetItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BudgetItemRepository extends JpaRepository<BudgetItem, Long> {
    List<BudgetItem> findByBudgetId(Long budgetId);
}
