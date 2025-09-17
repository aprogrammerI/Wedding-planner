package com.yourcompany.wedding.weddingbackend.service.impl;

import com.yourcompany.wedding.weddingbackend.dto.ItineraryItemDTO;
import com.yourcompany.wedding.weddingbackend.dto.ProgressDTO;
import com.yourcompany.wedding.weddingbackend.dto.WeddingDetailsDTO;
import com.yourcompany.wedding.weddingbackend.dto.WeddingDetailsPageDTO;
import com.yourcompany.wedding.weddingbackend.model.Budget;
import com.yourcompany.wedding.weddingbackend.model.Guest;
import com.yourcompany.wedding.weddingbackend.model.RsvpStatus;
import com.yourcompany.wedding.weddingbackend.repository.*;
import com.yourcompany.wedding.weddingbackend.service.TaskService;
import com.yourcompany.wedding.weddingbackend.service.WeddingDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;



import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WeddingDetailsServiceImpl implements WeddingDetailsService {

    private final WeddingDetailsRepository weddingDetailsRepository;
    private final GuestRepository guestRepository;
    private final ItineraryItemRepository itineraryItemRepository;
    private final ExpenseRepository expenseRepository;
    private final BudgetRepository budgetRepository;

    private final BudgetItemRepository budgetItemRepository; // add this
    private final TaskService taskService;

    @Override
    public Optional<WeddingDetailsDTO> getWeddingDetails(Long userId) {
        return weddingDetailsRepository.findTopByOwnerIdOrderByIdAsc(userId).map(this::toDto);
    }

    @Override
    @Transactional
    public WeddingDetailsDTO saveWeddingDetails(Long userId, WeddingDetailsDTO dto) {
        var entity = weddingDetailsRepository.findTopByOwnerIdOrderByIdAsc(userId)
                .orElseGet(() -> com.yourcompany.wedding.weddingbackend.model.WeddingDetails.builder().ownerId(userId).build());

        entity.setBrideFirstName(dto.getBrideFirstName());
        entity.setBrideLastName(dto.getBrideLastName());
        entity.setBrideAge(dto.getBrideAge());
        entity.setGroomFirstName(dto.getGroomFirstName());
        entity.setGroomLastName(dto.getGroomLastName());
        entity.setGroomAge(dto.getGroomAge());
        entity.setWeddingDate(dto.getWeddingDate());
        entity.setWeddingLocation(dto.getWeddingLocation());

        var saved = weddingDetailsRepository.save(entity);
        return toDto(saved);
    }

    @Override
    public WeddingDetailsPageDTO getWeddingDetailsPageData(Long userId) {
        var wdOpt = weddingDetailsRepository.findTopByOwnerIdOrderByIdAsc(userId);

        String brideFirst = wdOpt.map(com.yourcompany.wedding.weddingbackend.model.WeddingDetails::getBrideFirstName).orElse(null);
        String brideLast  = wdOpt.map(com.yourcompany.wedding.weddingbackend.model.WeddingDetails::getBrideLastName).orElse(null);
        Integer brideAge  = wdOpt.map(com.yourcompany.wedding.weddingbackend.model.WeddingDetails::getBrideAge).orElse(null);

        String groomFirst = wdOpt.map(com.yourcompany.wedding.weddingbackend.model.WeddingDetails::getGroomFirstName).orElse(null);
        String groomLast  = wdOpt.map(com.yourcompany.wedding.weddingbackend.model.WeddingDetails::getGroomLastName).orElse(null);
        Integer groomAge  = wdOpt.map(com.yourcompany.wedding.weddingbackend.model.WeddingDetails::getGroomAge).orElse(null);

        var weddingDate = wdOpt.map(com.yourcompany.wedding.weddingbackend.model.WeddingDetails::getWeddingDate).orElse(null);
        var weddingLocation = wdOpt.map(com.yourcompany.wedding.weddingbackend.model.WeddingDetails::getWeddingLocation).orElse(null);

        Long detailsId = wdOpt.map(com.yourcompany.wedding.weddingbackend.model.WeddingDetails::getId).orElse(null);

        List<Guest> guests = guestRepository.findByOwnerId(userId);
        int brideGuestCount = (int) guests.stream().filter(g -> g.getSide() != null && g.getSide().name().equalsIgnoreCase("BRIDE")).count();
        int groomGuestCount = (int) guests.stream().filter(g -> g.getSide() != null && g.getSide().name().equalsIgnoreCase("GROOM")).count();
        int totalGuestCount = guests.size();
        int confirmedRsvpsCount = (int) guests.stream().filter(g -> g.getRsvpStatus() == RsvpStatus.ACCEPTED).count();

        ProgressDTO progress = taskService.getProgress(userId);
        int completedTasks = progress == null ? 0 : progress.completed();
        int totalTasks = progress == null ? 0 : progress.total();
        double tasksCompletionPercentage = progress == null ? 0.0 : progress.percentage();

//        BigDecimal spent = expenseRepository.sumAllAmounts(); // scope per user later if needed
//        double spentAmount = spent == null ? 0.0 : spent.doubleValue();
//
//        Optional<Budget> budgetOpt = budgetRepository.findByOwnerId(userId);
//        Double totalBudgetAmount = null;
//        Double remainingAmount = null;
//        Double budgetUtilizationPercentage = null;
//        if (budgetOpt.isPresent()) {
//            Budget b = budgetOpt.get();
//            totalBudgetAmount = b.getTotalBudget();
//            remainingAmount = totalBudgetAmount - spentAmount;
//            budgetUtilizationPercentage = totalBudgetAmount == 0 ? 0.0 : (spentAmount * 100.0 / totalBudgetAmount);
//        }


        double spentAmount = 0.0;

        Optional<Budget> budgetOpt = budgetRepository.findByOwnerId(userId);
        Double totalBudgetAmount = null;
        Double remainingAmount = null;
        Double budgetUtilizationPercentage = null;

        if (budgetOpt.isPresent()) {
            Budget b = budgetOpt.get();

            // Sum amounts from this user's budget items
            spentAmount = budgetItemRepository.findByBudget(b).stream()
                    .mapToDouble(item -> item.getAmount())
                    .sum();

            totalBudgetAmount = b.getTotalBudget();
            remainingAmount = totalBudgetAmount - spentAmount;
            budgetUtilizationPercentage = totalBudgetAmount == 0 ? 0.0 : (spentAmount * 100.0 / totalBudgetAmount);
        }


        List<ItineraryItemDTO> itineraryDtos = itineraryItemRepository.findByOwnerIdOrderByTimeAsc(userId).stream()
                .map(it -> new ItineraryItemDTO(it.getId(), it.getTime(), it.getEventName(), it.getDescription()))
                .collect(Collectors.toList());

        return WeddingDetailsPageDTO.builder()
                .detailsId(detailsId)
                .weddingName(null)
                .brideFirstName(brideFirst)
                .brideLastName(brideLast)
                .brideAge(brideAge)
                .groomFirstName(groomFirst)
                .groomLastName(groomLast)
                .groomAge(groomAge)
                .weddingDate(weddingDate)
                .weddingLocation(weddingLocation)
                .brideGuestCount(brideGuestCount)
                .groomGuestCount(groomGuestCount)
                .totalGuestCount(totalGuestCount)
                .confirmedRsvpsCount(confirmedRsvpsCount)
                .completedTasks(completedTasks)
                .totalTasks(totalTasks)
                .tasksCompletionPercentage(tasksCompletionPercentage)
                .totalBudgetAmount(totalBudgetAmount)
                .spentAmount(spentAmount)
                .remainingAmount(remainingAmount)
                .budgetUtilizationPercentage(budgetUtilizationPercentage)
                .itinerary(itineraryDtos)
                .build();
    }

    private WeddingDetailsDTO toDto(com.yourcompany.wedding.weddingbackend.model.WeddingDetails wd) {
        WeddingDetailsDTO dto = new WeddingDetailsDTO();
        dto.setId(wd.getId());
        dto.setBrideFirstName(wd.getBrideFirstName());
        dto.setBrideLastName(wd.getBrideLastName());
        dto.setBrideAge(wd.getBrideAge());
        dto.setGroomFirstName(wd.getGroomFirstName());
        dto.setGroomLastName(wd.getGroomLastName());
        dto.setGroomAge(wd.getGroomAge());
        dto.setWeddingDate(wd.getWeddingDate());
        dto.setWeddingLocation(wd.getWeddingLocation());
        return dto;
    }
}