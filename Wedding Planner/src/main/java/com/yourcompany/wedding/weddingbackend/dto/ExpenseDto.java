package com.yourcompany.wedding.weddingbackend.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpenseDto {
    private Long id;
    private String category;
    private BigDecimal amount;
    //private Long weddingId;
    // Removed weddingId field as it's no longer needed for a global scope
}
