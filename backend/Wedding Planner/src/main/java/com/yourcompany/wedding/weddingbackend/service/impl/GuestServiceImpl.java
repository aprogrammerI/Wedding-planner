// File: src/main/java/com/yourcompany/wedding/weddingbackend/service/impl/GuestServiceImpl.java
package com.yourcompany.wedding.weddingbackend.service.impl;

import com.yourcompany.wedding.weddingbackend.model.Guest;
import com.yourcompany.wedding.weddingbackend.model.GuestRole;
import com.yourcompany.wedding.weddingbackend.model.GuestSide;
import com.yourcompany.wedding.weddingbackend.model.RsvpStatus;
import com.yourcompany.wedding.weddingbackend.repository.GuestRepository;
import com.yourcompany.wedding.weddingbackend.service.GuestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class GuestServiceImpl implements GuestService {

    private final GuestRepository guestRepository;

    @Autowired
    public GuestServiceImpl(GuestRepository guestRepository) {
        this.guestRepository = guestRepository;
    }

    @Override
    public List<Guest> findAll(Long userId, String groupBy, String sortBy, String sortOrder) {
        List<Guest> guests = guestRepository.findByOwnerId(userId);

        Comparator<Guest> comparator = (g1, g2) -> 0;

        if ("side".equalsIgnoreCase(groupBy)) {
            comparator = comparator.thenComparing(Guest::getSide, Comparator.nullsLast((s1, s2) -> {
                if (s1 == GuestSide.BRIDE && s2 == GuestSide.GROOM) return -1;
                if (s1 == GuestSide.GROOM && s2 == GuestSide.BRIDE) return 1;
                return 0;
            }));
        } else if ("role".equalsIgnoreCase(groupBy)) {
            comparator = comparator.thenComparing(Guest::getRole, Comparator.nullsLast((r1, r2) -> {
                List<GuestRole> roleOrder = List.of(
                        GuestRole.BRIDESMAID, GuestRole.BEST_MAN, GuestRole.PARENT,
                        GuestRole.RELATIVE, GuestRole.FRIEND, GuestRole.GUEST
                );
                int index1 = roleOrder.indexOf(r1);
                int index2 = roleOrder.indexOf(r2);
                return Integer.compare(index1, index2);
            }));
        } else if ("rsvpStatus".equalsIgnoreCase(groupBy)) {
            comparator = comparator.thenComparing(Guest::getRsvpStatus, Comparator.nullsLast((r1, r2) -> {
                List<RsvpStatus> rsvpOrder = List.of(RsvpStatus.ACCEPTED, RsvpStatus.PENDING, RsvpStatus.DECLINED);
                int index1 = rsvpOrder.indexOf(r1);
                int index2 = rsvpOrder.indexOf(r2);
                return Integer.compare(index1, index2);
            }));
        }

        if (sortBy != null && !sortBy.isEmpty()) {
            Comparator<Guest> secondarySort;
            switch (sortBy.toLowerCase()) {
                case "name":
                    secondarySort = Comparator.comparing(Guest::getName, Comparator.nullsLast(String::compareToIgnoreCase));
                    break;
                case "tablenumber":
                    secondarySort = Comparator.comparing(Guest::getTableNumber, Comparator.nullsLast(Integer::compareTo));
                    break;
                default:
                    secondarySort = (g1, g2) -> 0;
            }
            if ("DESC".equalsIgnoreCase(sortOrder)) {
                secondarySort = secondarySort.reversed();
            }
            comparator = comparator.thenComparing(secondarySort);
        }

        return guests.stream().sorted(comparator).collect(Collectors.toList());
    }

    @Override
    public Optional<Guest> findById(Long userId, Long id) {
        return guestRepository.findById(id).filter(g -> userId.equals(g.getOwnerId()));
    }

    @Override
    @Transactional
    public Guest save(Long userId, Guest guest) {
        if (guest.getId() == null) {
            guest.setOwnerId(userId);
        } else if (!userId.equals(guest.getOwnerId())) {
            throw new RuntimeException("Forbidden: guest does not belong to this user");
        }
        return guestRepository.save(guest);
    }

    @Override
    @Transactional
    public void deleteById(Long userId, Long id) {
        Guest g = guestRepository.findById(id).orElseThrow(() -> new RuntimeException("Guest not found"));
        if (!userId.equals(g.getOwnerId())) throw new RuntimeException("Forbidden");
        guestRepository.deleteById(id);
    }

    @Override
    public List<Guest> findAllSorted(Long userId, String sortBy, String sortOrder) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortOrder), sortBy);
        return guestRepository.findByOwnerId(userId, sort);
    }

    @Override
    public List<Guest> findBySideSorted(Long userId, GuestSide side, String sortBy, String sortOrder) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortOrder), sortBy);
        return guestRepository.findByOwnerIdAndSide(userId, side, sort);
    }

    @Override
    public List<Guest> findByRoleSorted(Long userId, GuestRole role, String sortBy, String sortOrder) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortOrder), sortBy);
        return guestRepository.findByOwnerIdAndRole(userId, role, sort);
    }

    @Override
    public List<Guest> findByRsvpStatusSorted(Long userId, RsvpStatus rsvpStatus, String sortBy, String sortOrder) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortOrder), sortBy);
        return guestRepository.findByOwnerIdAndRsvpStatus(userId, rsvpStatus, sort);
    }
}