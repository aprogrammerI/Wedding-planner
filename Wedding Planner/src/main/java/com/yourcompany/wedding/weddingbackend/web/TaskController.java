package com.yourcompany.wedding.weddingbackend.web;

import com.yourcompany.wedding.weddingbackend.dto.OverdueReminderDTO;
import com.yourcompany.wedding.weddingbackend.dto.ProgressDTO;
import com.yourcompany.wedding.weddingbackend.dto.SubtaskDTO;
import com.yourcompany.wedding.weddingbackend.dto.TaskDTO;
import com.yourcompany.wedding.weddingbackend.model.Assignee;
import com.yourcompany.wedding.weddingbackend.model.Subtask;
import com.yourcompany.wedding.weddingbackend.model.Task;
import com.yourcompany.wedding.weddingbackend.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;

    @GetMapping
    public List<TaskDTO> getAllTasks(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam(required = false) Assignee assignee
    ) {
        if (assignee != null) {
            return taskService.getTasksByAssignee(userId, assignee);
        } else {
            return taskService.getAllTasks(userId);
        }
    }

    @PostMapping
    public TaskDTO createTask(@RequestHeader("X-User-Id") Long userId, @RequestBody Task task) {
        return taskService.createTask(userId, task);
    }

    @PutMapping("/{id}")
    public TaskDTO updateTask(@RequestHeader("X-User-Id") Long userId, @PathVariable Long id, @RequestBody Task updated) {
        return taskService.updateTask(userId, id, updated);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@RequestHeader("X-User-Id") Long userId, @PathVariable Long id) {
        taskService.deleteTask(userId, id);
    }

    @PatchMapping("/{taskId}/complete")
    public void updateTaskCompletion(@RequestHeader("X-User-Id") Long userId, @PathVariable Long taskId, @RequestParam boolean completed) {
        taskService.updateTaskCompletion(userId, taskId, completed);
    }

    @PostMapping("/{taskId}/subtasks")
    public SubtaskDTO addSubtask(@RequestHeader("X-User-Id") Long userId, @PathVariable Long taskId, @RequestBody Subtask subtask) {
        return taskService.addSubtask(userId, taskId, subtask);
    }

    @PutMapping("/{taskId}/subtasks/{subtaskId}")
    public SubtaskDTO updateSubtask(@RequestHeader("X-User-Id") Long userId, @PathVariable Long taskId, @PathVariable Long subtaskId, @RequestBody Subtask updated) {
        return taskService.updateSubtask(userId, taskId, subtaskId, updated);
    }

    @DeleteMapping("/{taskId}/subtasks/{subtaskId}")
    public void deleteSubtask(@RequestHeader("X-User-Id") Long userId, @PathVariable Long taskId, @PathVariable Long subtaskId) {
        taskService.deleteSubtask(userId, taskId, subtaskId);
    }

    @GetMapping("/progress")
    public ProgressDTO getProgress(@RequestHeader("X-User-Id") Long userId) {
        return taskService.getProgress(userId);
    }

    @GetMapping("/overdue")
    public List<OverdueReminderDTO> getOverdueReminders(@RequestHeader("X-User-Id") Long userId) {
        return taskService.getOverdueReminders(userId);
    }

    @GetMapping("/by-priority")
    public Map<String, List<TaskDTO>> getTasksGroupedByPriority(@RequestHeader("X-User-Id") Long userId) {
        return taskService.getTasksGroupedByPriority(userId);
    }
}