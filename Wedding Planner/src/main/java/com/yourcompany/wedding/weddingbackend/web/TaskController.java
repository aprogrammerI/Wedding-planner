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
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;

    //  Main tasks list (with subtasks embedded)
    @GetMapping
    public List<TaskDTO> getAllTasks(
            @RequestParam(required = false) Assignee assignee // optional query param
    ) {
        if (assignee != null) {
            return taskService.getTasksByAssignee(assignee);
        } else {
            return taskService.getAllTasks();
        }
    }

    @PostMapping
    public TaskDTO createTask(@RequestBody Task task) {
        return taskService.createTask(task);
    }

    @PutMapping("/{id}")
    public TaskDTO updateTask(@PathVariable Long id, @RequestBody Task updated) {
        return taskService.updateTask(id, updated);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }

    //  Task Completion Status
    @PatchMapping("/{taskId}/complete")
    public void updateTaskCompletion(@PathVariable Long taskId, @RequestParam boolean completed) {
        taskService.updateTaskCompletion(taskId, completed);
    }

    //  Subtasks
    @PostMapping("/{taskId}/subtasks")
    public SubtaskDTO addSubtask(@PathVariable Long taskId, @RequestBody Subtask subtask) {
        return taskService.addSubtask(taskId, subtask);
    }

    @PutMapping("/{taskId}/subtasks/{subtaskId}")
    public SubtaskDTO updateSubtask(@PathVariable Long taskId, @PathVariable Long subtaskId, @RequestBody Subtask updated) {
        return taskService.updateSubtask(taskId, subtaskId, updated);
    }

    @DeleteMapping("/{taskId}/subtasks/{subtaskId}")
    public void deleteSubtask(@PathVariable Long taskId, @PathVariable Long subtaskId) {
        taskService.deleteSubtask(taskId, subtaskId);
    }

    // ✅ Progress bar
    @GetMapping("/progress")
    public ProgressDTO getProgress() {
        return taskService.getProgress();
    }

    // ✅ Overdue reminders
    @GetMapping("/overdue")
    public List<OverdueReminderDTO> getOverdueReminders() {
        return taskService.getOverdueReminders();
    }

    // ✅ Tasks grouped by priority
    @GetMapping("/by-priority")
    public Map<String, List<TaskDTO>> getTasksGroupedByPriority() {
        return taskService.getTasksGroupedByPriority();
    }
}
