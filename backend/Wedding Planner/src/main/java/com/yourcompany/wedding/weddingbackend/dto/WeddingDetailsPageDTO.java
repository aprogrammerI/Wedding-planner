package com.yourcompany.wedding.weddingbackend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class WeddingDetailsPageDTO {
    private Long detailsId;
    private String weddingName;

    private String brideFirstName;
    private String brideLastName;
    private Integer brideAge;
    private String groomFirstName;
    private String groomLastName;
    private Integer groomAge;
    private LocalDate weddingDate;
    private String weddingLocation;

    private Integer brideGuestCount;
    private Integer groomGuestCount;
    private Integer totalGuestCount;
    private Integer confirmedRsvpsCount;

    private Integer completedTasks;
    private Integer totalTasks;
    private Double tasksCompletionPercentage;

    private Double totalBudgetAmount;
    private Double spentAmount;
    private Double remainingAmount;
    private Double budgetUtilizationPercentage;

    private List<ItineraryItemDTO> itinerary;
}
