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
    private final TaskService taskService; // global task service (non-wedding scoped)

    @Override
    public Optional<WeddingDetailsDTO> getWeddingDetails() {
        return weddingDetailsRepository.findAll().stream().findFirst().map(this::toDto);
    }

    @Override
    @Transactional
    public WeddingDetailsDTO saveWeddingDetails(WeddingDetailsDTO dto) {
        // If dto.id provided, update that record; else if any record exists update the first; else create new.
        com.yourcompany.wedding.weddingbackend.model.WeddingDetails entity;
        if (dto.getId() != null) {
            entity = weddingDetailsRepository.findById(dto.getId())
                    .orElseGet(() -> com.yourcompany.wedding.weddingbackend.model.WeddingDetails.builder().build());
        } else {
            entity = weddingDetailsRepository.findAll().stream().findFirst().orElseGet(
                    () -> com.yourcompany.wedding.weddingbackend.model.WeddingDetails.builder().build()
            );
        }

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
    public WeddingDetailsPageDTO getWeddingDetailsPageData() {
        // WeddingDetails (raw values) - pick first if present
        Optional<com.yourcompany.wedding.weddingbackend.model.WeddingDetails> wdOpt = weddingDetailsRepository.findAll().stream().findFirst();

        String brideFirst = wdOpt.map(com.yourcompany.wedding.weddingbackend.model.WeddingDetails::getBrideFirstName).orElse(null);
        String brideLast  = wdOpt.map(com.yourcompany.wedding.weddingbackend.model.WeddingDetails::getBrideLastName).orElse(null);
        Integer brideAge  = wdOpt.map(com.yourcompany.wedding.weddingbackend.model.WeddingDetails::getBrideAge).orElse(null);

        String groomFirst = wdOpt.map(com.yourcompany.wedding.weddingbackend.model.WeddingDetails::getGroomFirstName).orElse(null);
        String groomLast  = wdOpt.map(com.yourcompany.wedding.weddingbackend.model.WeddingDetails::getGroomLastName).orElse(null);
        Integer groomAge  = wdOpt.map(com.yourcompany.wedding.weddingbackend.model.WeddingDetails::getGroomAge).orElse(null);

        var weddingDate = wdOpt.map(com.yourcompany.wedding.weddingbackend.model.WeddingDetails::getWeddingDate).orElse(null);
        var weddingLocation = wdOpt.map(com.yourcompany.wedding.weddingbackend.model.WeddingDetails::getWeddingLocation).orElse(null);

        Long detailsId = wdOpt.map(com.yourcompany.wedding.weddingbackend.model.WeddingDetails::getId).orElse(null);

        // Guests: global findAll
        List<Guest> guests = guestRepository.findAll();

        int brideGuestCount = (int) guests.stream()
                .filter(g -> g.getSide() != null && g.getSide().name().equalsIgnoreCase("BRIDE"))
                .count();
        int groomGuestCount = (int) guests.stream()
                .filter(g -> g.getSide() != null && g.getSide().name().equalsIgnoreCase("GROOM"))
                .count();
        int totalGuestCount = guests.size();
        int confirmedRsvpsCount = (int) guests.stream()
                .filter(g -> g.getRsvpStatus() == RsvpStatus.ACCEPTED)
                .count();

        // Tasks: global service
        ProgressDTO progress = taskService.getProgress();
        int completedTasks = progress == null ? 0 : progress.completed();
        int totalTasks = progress == null ? 0 : progress.total();
        double tasksCompletionPercentage = progress == null ? 0.0 : progress.percentage();

        // Expenses: global sumAllAmounts
        BigDecimal spent = expenseRepository.sumAllAmounts();
        double spentAmount = spent == null ? 0.0 : spent.doubleValue();

        // Budget: pick first budget if present (single-wedding assumption)
        Double totalBudgetAmount = null;
        Double remainingAmount = null;
        Double budgetUtilizationPercentage = null;
        Optional<Budget> budgetOpt = budgetRepository.findTopByOrderByIdAsc();
        if (budgetOpt.isPresent()) {
            Budget b = budgetOpt.get();
            totalBudgetAmount = b.getTotalBudget();
            remainingAmount = totalBudgetAmount - spentAmount;
            budgetUtilizationPercentage = totalBudgetAmount == 0 ? 0.0 : (spentAmount * 100.0 / totalBudgetAmount);
        }

        // Itinerary: global findAllByOrderByTimeAsc
        List<ItineraryItemDTO> itineraryDtos = itineraryItemRepository.findAllByOrderByTimeAsc().stream()
                .map(it -> new ItineraryItemDTO(it.getId(), it.getTime(), it.getEventName(), it.getDescription()))
                .collect(Collectors.toList());

        return WeddingDetailsPageDTO.builder()
                .detailsId(detailsId)
                .weddingName(null) // Wedding name is no longer derived from Wedding entity
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
