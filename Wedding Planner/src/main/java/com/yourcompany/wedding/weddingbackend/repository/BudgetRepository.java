package com.yourcompany.wedding.weddingbackend.repository;

import com.yourcompany.wedding.weddingbackend.model.Budget;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
}
