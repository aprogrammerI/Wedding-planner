package com.yourcompany.wedding.weddingbackend.repository;

import com.yourcompany.wedding.weddingbackend.model.Budget;
import com.yourcompany.wedding.weddingbackend.model.BudgetItem;
import com.yourcompany.wedding.weddingbackend.model.CategoryType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BudgetItemRepository extends JpaRepository<BudgetItem, Long> {

    List<BudgetItem> findByBudget(Budget budget);

    List<BudgetItem> findByBudgetAndCategoryType(Budget budget, CategoryType categoryType);
}