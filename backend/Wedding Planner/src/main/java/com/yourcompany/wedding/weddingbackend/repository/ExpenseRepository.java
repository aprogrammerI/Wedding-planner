package com.yourcompany.wedding.weddingbackend.repository;

import com.yourcompany.wedding.weddingbackend.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    // Removed findByWeddingId as it's no longer needed for a global scope

    // New method to sum all expense amounts globally
    @Query("SELECT SUM(e.amount) FROM Expense e")
    BigDecimal sumAllAmounts();
}
