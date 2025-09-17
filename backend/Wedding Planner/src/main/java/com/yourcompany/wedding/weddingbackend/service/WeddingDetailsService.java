package com.yourcompany.wedding.weddingbackend.service;

import com.yourcompany.wedding.weddingbackend.dto.WeddingDetailsDTO;
import com.yourcompany.wedding.weddingbackend.dto.WeddingDetailsPageDTO;

import java.util.Optional;

public interface WeddingDetailsService {
    Optional<WeddingDetailsDTO> getWeddingDetails(Long userId);
    WeddingDetailsDTO saveWeddingDetails(Long userId, WeddingDetailsDTO dto);
    WeddingDetailsPageDTO getWeddingDetailsPageData(Long userId);
}