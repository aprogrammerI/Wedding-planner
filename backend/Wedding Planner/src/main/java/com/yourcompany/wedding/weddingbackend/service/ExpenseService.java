package com.yourcompany.wedding.weddingbackend.service;

import com.yourcompany.wedding.weddingbackend.model.Expense;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ExpenseService {
    List<Expense> findAll();
    Optional<Expense> findById(Long id);
    Expense save(Expense expense);
    void deleteById(Long id);

    // Restored: New method for global total spent
    BigDecimal getTotalSpent();
}
