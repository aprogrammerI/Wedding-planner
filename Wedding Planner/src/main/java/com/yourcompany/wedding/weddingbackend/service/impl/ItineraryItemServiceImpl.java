package com.yourcompany.wedding.weddingbackend.service.impl;

import com.yourcompany.wedding.weddingbackend.dto.ItineraryItemDTO;
import com.yourcompany.wedding.weddingbackend.model.ItineraryItem;
import com.yourcompany.wedding.weddingbackend.repository.ItineraryItemRepository;
import com.yourcompany.wedding.weddingbackend.service.ItineraryItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ItineraryItemServiceImpl implements ItineraryItemService {

    private final ItineraryItemRepository itineraryItemRepository;

    @Override
    public List<ItineraryItemDTO> getItinerary() {
        return itineraryItemRepository.findAllByOrderByTimeAsc().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ItineraryItemDTO addItineraryItem(ItineraryItemDTO dto) {
        // Normalize to minutes (zero seconds + nanos)
        LocalTime timeToCheck = normalizeToMinutes(dto.getTime());

        if (isDoubleBooked(timeToCheck, null)) {
            throw new RuntimeException("Double booking detected for " + timeToCheck);
        }

        ItineraryItem item = ItineraryItem.builder()
                .time(timeToCheck)
                .eventName(dto.getEventName())
                .description(dto.getDescription())
                .build();

        ItineraryItem saved = itineraryItemRepository.save(item);
        return mapToDTO(saved);
    }

    @Override
    @Transactional
    public ItineraryItemDTO updateItineraryItem(Long itemId, ItineraryItemDTO dto) {
        ItineraryItem existingItem = itineraryItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Itinerary item not found with ID: " + itemId));

        LocalTime newTime = normalizeToMinutes(dto.getTime());

        if (!normalizeToMinutes(existingItem.getTime()).equals(newTime)) {
            if (isDoubleBooked(newTime, itemId)) {
                throw new RuntimeException("Double booking detected for " + newTime);
            }
        }

        existingItem.setTime(newTime);
        existingItem.setEventName(dto.getEventName());
        existingItem.setDescription(dto.getDescription());

        ItineraryItem updated = itineraryItemRepository.save(existingItem);
        return mapToDTO(updated);
    }

    @Override
    @Transactional
    public void deleteItineraryItem(Long itemId) {
        ItineraryItem existingItem = itineraryItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Itinerary item not found with ID: " + itemId));
        itineraryItemRepository.delete(existingItem);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isDoubleBooked(LocalTime time, Long currentItemId) {
        LocalTime truncatedTime = normalizeToMinutes(time);

        List<ItineraryItem> sameTimeItems = itineraryItemRepository.findByTime(truncatedTime);
        boolean conflict = sameTimeItems.stream()
                .anyMatch(item -> currentItemId == null || !item.getId().equals(currentItemId));

        return conflict;
    }

    private LocalTime normalizeToMinutes(LocalTime time) {
        return time.withSecond(0).withNano(0);
    }

    private ItineraryItemDTO mapToDTO(ItineraryItem itineraryItem) {
        return ItineraryItemDTO.builder()
                .id(itineraryItem.getId())
                .time(itineraryItem.getTime())
                .eventName(itineraryItem.getEventName())
                .description(itineraryItem.getDescription())
                .build();
    }
}





//package com.yourcompany.wedding.weddingbackend.service.impl;
//
//import com.yourcompany.wedding.weddingbackend.dto.ItineraryItemDTO;
//import com.yourcompany.wedding.weddingbackend.model.ItineraryItem;
//import com.yourcompany.wedding.weddingbackend.repository.ItineraryItemRepository;
//import com.yourcompany.wedding.weddingbackend.service.ItineraryItemService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalTime;
//import java.time.temporal.ChronoUnit;
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//@Transactional(readOnly = true)
//public class ItineraryItemServiceImpl implements ItineraryItemService {
//
//    private final ItineraryItemRepository itineraryItemRepository;
//
//    @Override
//    public List<ItineraryItemDTO> getItinerary() {
//        return itineraryItemRepository.findAllByOrderByTimeAsc().stream()
//                .map(this::mapToDTO)
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    @Transactional
//    public ItineraryItemDTO addItineraryItem(ItineraryItemDTO dto) {
//        // Truncate time to minutes before checking double booking
//        LocalTime timeToCheck = dto.getTime().truncatedTo(java.time.temporal.ChronoUnit.MINUTES);
//
//        if (isDoubleBooked(timeToCheck, null)) {
//            throw new RuntimeException("Double booking detected for " + timeToCheck);
//        }
//
//        ItineraryItem item = ItineraryItem.builder()
//                .time(timeToCheck)
//                .eventName(dto.getEventName())
//                .description(dto.getDescription())
//                .build();
//
//        ItineraryItem saved = itineraryItemRepository.save(item);
//        return mapToDTO(saved);
//    }
//
//    @Override
//    @Transactional
//    public ItineraryItemDTO updateItineraryItem(Long itemId, ItineraryItemDTO dto) {
//        ItineraryItem existingItem = itineraryItemRepository.findById(itemId)
//                .orElseThrow(() -> new RuntimeException("Itinerary item not found with ID: " + itemId));
//
//        LocalTime newTime = dto.getTime().truncatedTo(java.time.temporal.ChronoUnit.MINUTES);
//
//        if (!existingItem.getTime().truncatedTo(java.time.temporal.ChronoUnit.MINUTES).equals(newTime)) {
//            if (isDoubleBooked(newTime, itemId)) {
//                throw new RuntimeException("Double booking detected for " + newTime);
//            }
//        }
//
//        existingItem.setTime(newTime);
//        existingItem.setEventName(dto.getEventName());
//        existingItem.setDescription(dto.getDescription());
//
//        ItineraryItem updated = itineraryItemRepository.save(existingItem);
//        return mapToDTO(updated);
//    }
//
//    @Override
//    @Transactional
//    public void deleteItineraryItem(Long itemId) {
//        ItineraryItem existingItem = itineraryItemRepository.findById(itemId)
//                .orElseThrow(() -> new RuntimeException("Itinerary item not found with ID: " + itemId));
//        itineraryItemRepository.delete(existingItem);
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public boolean isDoubleBooked(LocalTime time, Long currentItemId) {
//        // Truncate to minutes to avoid nanosecond issues
//        LocalTime truncatedTime = time.truncatedTo(java.time.temporal.ChronoUnit.MINUTES);
//
//        List<ItineraryItem> conflictingItems = itineraryItemRepository.findAll().stream()
//                .filter(item -> item.getTime().truncatedTo(java.time.temporal.ChronoUnit.MINUTES)
//                        .equals(truncatedTime))
//                .filter(item -> currentItemId == null || !item.getId().equals(currentItemId))
//                .toList();
//
//        return !conflictingItems.isEmpty();
//    }
//
//    private ItineraryItemDTO mapToDTO(ItineraryItem itineraryItem) {
//        return ItineraryItemDTO.builder()
//                .id(itineraryItem.getId())
//                .time(itineraryItem.getTime())
//                .eventName(itineraryItem.getEventName())
//                .description(itineraryItem.getDescription())
//                .build();
//    }
//}