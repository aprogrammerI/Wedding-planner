package com.yourcompany.wedding.weddingbackend.service.impl;

import com.yourcompany.wedding.weddingbackend.model.Expense;
import com.yourcompany.wedding.weddingbackend.repository.ExpenseRepository;
import com.yourcompany.wedding.weddingbackend.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;

    @Autowired
    public ExpenseServiceImpl(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    @Override
    public List<Expense> findAll() {
        return expenseRepository.findAll();
    }

    @Override
    public Optional<Expense> findById(Long id) {
        return expenseRepository.findById(id);
    }

    @Override
    @Transactional
    public Expense save(Expense expense) {
        return expenseRepository.save(expense);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        expenseRepository.deleteById(id);
    }

    @Override
    public BigDecimal getTotalSpent() {
        BigDecimal totalSpent = expenseRepository.sumAllAmounts();
        return totalSpent != null ? totalSpent : BigDecimal.ZERO;
    }
    // Removed all wedding-scoped expense methods (getExpensesByWeddingId and getTotalSpentByWeddingId)
}
