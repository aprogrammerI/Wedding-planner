package com.yourcompany.wedding.weddingbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BudgetDTO {
    private Long id;
    private Double totalBudget;
    private Double remaining;
    private Double totalSpent;
    private List<BudgetItemDTO> itemDTOs;
    private List<BudgetCategoryDTO> allCategoryDTOs;
}
