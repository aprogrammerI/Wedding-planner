package com.yourcompany.wedding.weddingbackend.dto;

import com.yourcompany.wedding.weddingbackend.model.CategoryType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BudgetItemDTO {
    private Long id;
    private String itemName;
    private Double amount;
    private CategoryType categoryType;
}
