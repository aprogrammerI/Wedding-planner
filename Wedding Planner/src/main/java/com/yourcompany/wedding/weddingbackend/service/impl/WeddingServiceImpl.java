package com.yourcompany.wedding.weddingbackend.service.impl;

import com.yourcompany.wedding.weddingbackend.model.Wedding;
import com.yourcompany.wedding.weddingbackend.repository.WeddingRepository;
import com.yourcompany.wedding.weddingbackend.service.WeddingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WeddingServiceImpl implements WeddingService {

    private final WeddingRepository weddingRepository;

    @Autowired
    public WeddingServiceImpl(WeddingRepository weddingRepository) {
        this.weddingRepository = weddingRepository;
    }

    @Override
    public List<Wedding> findAll() {
        return weddingRepository.findAll();
    }

    @Override
    public Optional<Wedding> findById(Long id) {
        return weddingRepository.findById(id);
    }

    @Override
    public Wedding save(Wedding wedding) {
        return weddingRepository.save(wedding);
    }

    @Override
    public void deleteById(Long id) {
        weddingRepository.deleteById(id);
    }
}
