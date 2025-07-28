package com.yourcompany.wedding.weddingbackend.web;


import com.yourcompany.wedding.weddingbackend.dto.TaskDto;
import com.yourcompany.wedding.weddingbackend.model.Task;
import com.yourcompany.wedding.weddingbackend.service.TaskService;
import com.yourcompany.wedding.weddingbackend.service.UserService;
import com.yourcompany.wedding.weddingbackend.service.WeddingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService taskService;
    private final WeddingService weddingService;
    private final UserService userService;

    @Autowired
    public TaskController(TaskService taskService, WeddingService weddingService, UserService userService) {
        this.taskService = taskService;
        this.weddingService = weddingService;
        this.userService = userService;
    }

    @GetMapping
    public List<TaskDto> getAll() {
        return taskService.findAll().stream()
                .map(t -> new TaskDto(t.getId(), t.getDescription(), t.isCompleted(), t.getWedding().getId(), t.getAssignedTo().getId()))
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskDto> getById(@PathVariable Long id) {
        return taskService.findById(id)
                .map(t -> ResponseEntity.ok(new TaskDto(t.getId(), t.getDescription(), t.isCompleted(), t.getWedding().getId(), t.getAssignedTo().getId())))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public TaskDto create(@RequestBody TaskDto dto) {
        Task t = Task.builder()
                .description(dto.getDescription())
                .completed(dto.isCompleted())
                .wedding(weddingService.findById(dto.getWeddingId()).orElse(null))
                .assignedTo(userService.findById(dto.getAssignedToId()).orElse(null))
                .build();
        Task saved = taskService.save(t);
        return new TaskDto(saved.getId(), saved.getDescription(), saved.isCompleted(), saved.getWedding().getId(), saved.getAssignedTo().getId());
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDto> update(@PathVariable Long id, @RequestBody TaskDto dto) {
        return taskService.findById(id).map(existing -> {
            existing.setDescription(dto.getDescription());
            existing.setCompleted(dto.isCompleted());
            existing.setWedding(weddingService.findById(dto.getWeddingId()).orElse(existing.getWedding()));
            existing.setAssignedTo(userService.findById(dto.getAssignedToId()).orElse(existing.getAssignedTo()));
            Task updated = taskService.save(existing);
            return ResponseEntity.ok(new TaskDto(updated.getId(), updated.getDescription(), updated.isCompleted(), updated.getWedding().getId(), updated.getAssignedTo().getId()));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        taskService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
