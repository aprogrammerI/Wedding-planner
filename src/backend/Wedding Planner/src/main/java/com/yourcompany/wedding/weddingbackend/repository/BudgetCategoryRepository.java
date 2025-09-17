package com.yourcompany.wedding.weddingbackend.repository;

import com.yourcompany.wedding.weddingbackend.model.Budget;
import com.yourcompany.wedding.weddingbackend.model.BudgetCategory;
import com.yourcompany.wedding.weddingbackend.model.CategoryType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetCategoryRepository extends JpaRepository<BudgetCategory, Long> {

    Optional<BudgetCategory> findByBudgetAndCategoryType(Budget budget, CategoryType categoryType);

    List<BudgetCategory> findByBudget(Budget budget);
}