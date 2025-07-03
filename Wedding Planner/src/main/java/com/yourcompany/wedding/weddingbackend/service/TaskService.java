package com.yourcompany.wedding.weddingbackend.service;

import com.yourcompany.wedding.weddingbackend.model.Task;

import java.util.List;
import java.util.Optional;

public interface TaskService {
    List<Task> findAll();
    Optional<Task> findById(Long id);
    Task save(Task task);
    void deleteById(Long id);
}