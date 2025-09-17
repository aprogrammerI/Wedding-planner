package com.yourcompany.wedding.weddingbackend.service.impl;

import com.yourcompany.wedding.weddingbackend.dto.ItineraryItemDTO;
import com.yourcompany.wedding.weddingbackend.model.ItineraryItem;
import com.yourcompany.wedding.weddingbackend.repository.ItineraryItemRepository;
import com.yourcompany.wedding.weddingbackend.service.ItineraryItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ItineraryItemServiceImpl implements ItineraryItemService {

    private final ItineraryItemRepository repo;

    @Override
    public List<ItineraryItemDTO> getItinerary(Long userId) {
        return repo.findByOwnerIdOrderByTimeAsc(userId).stream()
                .map(i -> new ItineraryItemDTO(i.getId(), i.getTime(), i.getEventName(), i.getDescription()))
                .toList();
    }

//    @Override
//    @Transactional
//    public ItineraryItemDTO addItineraryItem(Long userId, ItineraryItemDTO dto) {
//        ItineraryItem entity = ItineraryItem.builder()
//                .ownerId(userId)
//                .time(dto.getTime())
//                .eventName(dto.getEventName())
//                .description(dto.getDescription())
//                .build();
//        ItineraryItem saved = repo.save(entity);
//        return new ItineraryItemDTO(saved.getId(), saved.getTime(), saved.getEventName(), saved.getDescription());
//    }


    @Override
    @Transactional
    public ItineraryItemDTO addItineraryItem(Long userId, ItineraryItemDTO dto) {
        var time = dto.getTime();
        var name = dto.getEventName() == null ? null : dto.getEventName().trim();

        // In-memory duplicate check: same user + same HH:mm (ignore seconds) → reject
        var existingForUser = repo.findByOwnerIdOrderByTimeAsc(userId);
        boolean dup = time != null && existingForUser.stream().anyMatch(i ->
                i.getTime() != null &&
                        i.getTime().getHour() == time.getHour() &&
                        i.getTime().getMinute() == time.getMinute()
        );
        if (dup) {
            throw new RuntimeException("Duplicate itinerary time for this user");
        }

        ItineraryItem entity = ItineraryItem.builder()
                .ownerId(userId)
                .time(time)
                .eventName(name)
                .description(dto.getDescription())
                .build();
        ItineraryItem saved = repo.save(entity);
        return new ItineraryItemDTO(saved.getId(), saved.getTime(), saved.getEventName(), saved.getDescription());
    }
//    @Override
//    @Transactional
//    public ItineraryItemDTO updateItineraryItem(Long userId, Long itemId, ItineraryItemDTO dto) {
//        ItineraryItem existing = repo.findById(itemId).orElseThrow(() -> new RuntimeException("Itinerary item not found"));
//        if (!userId.equals(existing.getOwnerId())) throw new RuntimeException("Forbidden");
//        if (dto.getTime() != null) existing.setTime(dto.getTime());
//        if (dto.getEventName() != null) existing.setEventName(dto.getEventName());
//        if (dto.getDescription() != null) existing.setDescription(dto.getDescription());
//        ItineraryItem saved = repo.save(existing);
//        return new ItineraryItemDTO(saved.getId(), saved.getTime(), saved.getEventName(), saved.getDescription());
//    }


    @Override
    @Transactional
    public ItineraryItemDTO updateItineraryItem(Long userId, Long itemId, ItineraryItemDTO dto) {
        ItineraryItem existing = repo.findById(itemId).orElseThrow(() -> new RuntimeException("Itinerary item not found"));
        if (!userId.equals(existing.getOwnerId())) throw new RuntimeException("Forbidden");

        var newTime = dto.getTime() != null ? dto.getTime() : existing.getTime();
        var newName = dto.getEventName() != null ? dto.getEventName().trim() : existing.getEventName();

        // In-memory duplicate check excluding self (same HH:mm)
        if (newTime != null) {
            var existingForUser = repo.findByOwnerIdOrderByTimeAsc(userId);
            boolean conflict = existingForUser.stream().anyMatch(i ->
                    !i.getId().equals(itemId) &&
                            i.getTime() != null &&
                            i.getTime().getHour() == newTime.getHour() &&
                            i.getTime().getMinute() == newTime.getMinute()
            );
            if (conflict) {
                throw new RuntimeException("Duplicate itinerary time for this user");
            }
        }

        if (dto.getTime() != null) existing.setTime(newTime);
        if (dto.getEventName() != null) existing.setEventName(newName);
        if (dto.getDescription() != null) existing.setDescription(dto.getDescription());

        ItineraryItem saved = repo.save(existing);
        return new ItineraryItemDTO(saved.getId(), saved.getTime(), saved.getEventName(), saved.getDescription());
    }

    @Override
    @Transactional
    public void deleteItineraryItem(Long userId, Long itemId) {
        ItineraryItem existing = repo.findById(itemId).orElseThrow(() -> new RuntimeException("Itinerary item not found"));
        if (!userId.equals(existing.getOwnerId())) throw new RuntimeException("Forbidden");
        repo.delete(existing);
    }
}