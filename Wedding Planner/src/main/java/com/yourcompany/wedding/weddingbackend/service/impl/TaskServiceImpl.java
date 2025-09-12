
package com.yourcompany.wedding.weddingbackend.service.impl;

import com.yourcompany.wedding.weddingbackend.dto.OverdueReminderDTO;
import com.yourcompany.wedding.weddingbackend.dto.ProgressDTO;
import com.yourcompany.wedding.weddingbackend.dto.SubtaskDTO;
import com.yourcompany.wedding.weddingbackend.dto.TaskDTO;
import com.yourcompany.wedding.weddingbackend.model.Assignee;
import com.yourcompany.wedding.weddingbackend.model.Priority;
import com.yourcompany.wedding.weddingbackend.model.Subtask;
import com.yourcompany.wedding.weddingbackend.model.Task;
import com.yourcompany.wedding.weddingbackend.repository.SubtaskRepository;
import com.yourcompany.wedding.weddingbackend.repository.TaskRepository;
import com.yourcompany.wedding.weddingbackend.service.TaskService;
import com.yourcompany.wedding.weddingbackend.service.VendorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepo;
    private final SubtaskRepository subtaskRepo;
    private final VendorService vendorService;

    @Override
    public List<TaskDTO> getAllTasks() {
        return taskRepo.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskDTO> getTasksByAssignee(Assignee assignee) {
        return taskRepo.findByAssignee(assignee).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TaskDTO createTask(Task task) {
        Task saved = taskRepo.save(task);
        return mapToDTO(saved);
    }

    @Override
    @Transactional
    public TaskDTO updateTask(Long id, Task updated) {
        Task existing = taskRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setDueDate(updated.getDueDate());
        existing.setPriority(updated.getPriority());
        existing.setAssignee(updated.getAssignee());
        existing.setCompleted(updated.isCompleted());
        existing.setReminderEnabled(updated.isReminderEnabled());

        // If frontend sends subtasks in `updated`, you may want to sync them here.
        return mapToDTO(taskRepo.save(existing));
    }

    @Override
    @Transactional
    public void deleteTask(Long id)
    {
        vendorService.unassignTaskFromAllVendors(id);

        taskRepo.deleteById(id);
    }

    @Override
    @Transactional
    public SubtaskDTO addSubtask(Long taskId, Subtask subtask) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        subtask.setTask(task);
        Subtask saved = subtaskRepo.save(subtask);
        return new SubtaskDTO(saved.getId(), saved.getTitle(), saved.isCompleted());
    }

    @Override
    @Transactional
    public SubtaskDTO updateSubtask(Long taskId, Long subtaskId, Subtask updated) {
        Subtask existing = subtaskRepo.findById(subtaskId)
                .orElseThrow(() -> new RuntimeException("Subtask not found"));
        if (!existing.getTask().getId().equals(taskId)) {
            throw new RuntimeException("Subtask does not belong to the given task");
        }
        existing.setTitle(updated.getTitle());
        existing.setCompleted(updated.isCompleted());
        Subtask saved = subtaskRepo.save(existing);
        return new SubtaskDTO(saved.getId(), saved.getTitle(), saved.isCompleted());
    }

    @Override
    @Transactional
    public void deleteSubtask(Long taskId, Long subtaskId) {
        Subtask existing = subtaskRepo.findById(subtaskId)
                .orElseThrow(() -> new RuntimeException("Subtask not found"));
        if (!existing.getTask().getId().equals(taskId)) {
            throw new RuntimeException("Subtask does not belong to the given task");
        }
        subtaskRepo.delete(existing);
    }

    @Override
    @Transactional
    public void updateTaskCompletion(Long taskId, boolean completed) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setCompleted(completed);
        taskRepo.save(task);

        // Update all subtasks for this task
        // ensure subtasks are present (depending on fetch type)
        task.getSubtasks().forEach(subtask -> {
            subtask.setCompleted(completed);
            subtaskRepo.save(subtask);
        });

        if (completed) {
            vendorService.unassignTaskFromAllVendors(taskId);
        }
    }

    @Override
    public ProgressDTO getProgress() {
        int total = (int) taskRepo.count();
        int completed = taskRepo.findByCompleted(true).size();
        double percentage = total == 0 ? 0.0 : (completed * 100.0 / total);
        return new ProgressDTO(completed, total, percentage);
    }

    @Override
    public List<OverdueReminderDTO> getOverdueReminders() {
        // repo filters: reminder enabled, not completed, dueDate < today
        List<Task> overdue = taskRepo.findByReminderEnabledAndCompletedFalseAndDueDateBefore(true, LocalDate.now());

        return overdue.stream()
                .filter(t -> t.getDueDate() != null) // safety
                .map(t -> {
                    long daysOverdue = LocalDate.now().toEpochDay() - t.getDueDate().toEpochDay();
                    return new OverdueReminderDTO(t.getTitle(), daysOverdue, t.getAssignee());
                })
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, List<TaskDTO>> getTasksGroupedByPriority() {
        // Fetch tasks as entities and group by Priority to avoid depending on DTO getters
        List<Task> tasks = taskRepo.findAll();

        Map<Priority, List<TaskDTO>> groupedEntities = tasks.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getPriority() == null ? Priority.MEDIUM : t.getPriority(), // null safety
                        Collectors.mapping(this::mapToDTO, Collectors.toList())
                ));

        // Ensure order HIGH -> MEDIUM -> LOW (LinkedHashMap preserves insertion order)
        Map<String, List<TaskDTO>> result = new LinkedHashMap<>();
        result.put(Priority.HIGH.name(), groupedEntities.getOrDefault(Priority.HIGH, List.of()));
        result.put(Priority.MEDIUM.name(), groupedEntities.getOrDefault(Priority.MEDIUM, List.of()));
        result.put(Priority.LOW.name(), groupedEntities.getOrDefault(Priority.LOW, List.of()));

        return result;
    }

    /* ----------------- Helpers ----------------- */

    private TaskDTO mapToDTO(Task task) {
        List<SubtaskDTO> subtasks = task.getSubtasks() == null
                ? List.of()
                : task.getSubtasks().stream()
                .map(s -> new SubtaskDTO(s.getId(), s.getTitle(), s.isCompleted()))
                .collect(Collectors.toList());

        return new TaskDTO(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getDueDate(),
                task.getPriority(),
                task.getAssignee(),
                task.isCompleted(),
                task.isReminderEnabled(),
                subtasks
        );
    }
}




//package com.yourcompany.wedding.weddingbackend.service.impl;
//
//import com.yourcompany.wedding.weddingbackend.dto.OverdueReminderDTO;
//import com.yourcompany.wedding.weddingbackend.dto.ProgressDTO;
//import com.yourcompany.wedding.weddingbackend.dto.SubtaskDTO;
//import com.yourcompany.wedding.weddingbackend.dto.TaskDTO;
//import com.yourcompany.wedding.weddingbackend.model.Assignee;
//import com.yourcompany.wedding.weddingbackend.model.Priority;
//import com.yourcompany.wedding.weddingbackend.model.Subtask;
//import com.yourcompany.wedding.weddingbackend.model.Task;
//import com.yourcompany.wedding.weddingbackend.model.Wedding;
//import com.yourcompany.wedding.weddingbackend.repository.SubtaskRepository;
//import com.yourcompany.wedding.weddingbackend.repository.TaskRepository;
//import com.yourcompany.wedding.weddingbackend.service.TaskService;
//import com.yourcompany.wedding.weddingbackend.service.VendorService;
//import com.yourcompany.wedding.weddingbackend.service.WeddingService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalDate;
//import java.util.LinkedHashMap;
//import java.util.List;
//import java.util.Map;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//@Transactional(readOnly = true)
//public class TaskServiceImpl implements TaskService {
//
//    private final TaskRepository taskRepo;
//    private final SubtaskRepository subtaskRepo;
//    private final VendorService vendorService;
//    private final WeddingService weddingService;
//
//    // Removed old non-wedding-scoped methods (throwing UnsupportedOperationException)
//
//    // --- New Wedding-scoped methods ---
//
//    @Override
//    public List<TaskDTO> getAllTasksForWedding(Long weddingId) {
//        weddingService.findById(weddingId)
//                .orElseThrow(() -> new RuntimeException("Wedding not found with ID: " + weddingId));
//        return taskRepo.findAllByWeddingId(weddingId).stream()
//                .map(this::mapToDTO)
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    public List<TaskDTO> getTasksByAssigneeForWedding(Long weddingId, Assignee assignee) {
//        weddingService.findById(weddingId)
//                .orElseThrow(() -> new RuntimeException("Wedding not found with ID: " + weddingId));
//        return taskRepo.findByWeddingIdAndAssignee(weddingId, assignee).stream()
//                .map(this::mapToDTO)
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    @Transactional
//    public TaskDTO createTaskForWedding(Long weddingId, Task task) {
//        Wedding wedding = weddingService.findById(weddingId)
//                .orElseThrow(() -> new RuntimeException("Wedding not found with ID: " + weddingId));
//        task.setWedding(wedding);
//        Task saved = taskRepo.save(task);
//        return mapToDTO(saved);
//    }
//
//    @Override
//    @Transactional
//    public TaskDTO updateTaskForWedding(Long weddingId, Long id, Task updated) {
//        Wedding wedding = weddingService.findById(weddingId)
//                .orElseThrow(() -> new RuntimeException("Wedding not found with ID: " + weddingId));
//        Task existing = taskRepo.findById(id)
//                .orElseThrow(() -> new RuntimeException("Task not found with ID: " + id));
//
//        if (!existing.getWedding().getId().equals(weddingId)) {
//            throw new RuntimeException("Task does not belong to the specified wedding.");
//        }
//
//        existing.setTitle(updated.getTitle());
//        existing.setDescription(updated.getDescription());
//        existing.setDueDate(updated.getDueDate());
//        existing.setPriority(updated.getPriority());
//        existing.setAssignee(updated.getAssignee());
//        existing.setCompleted(updated.isCompleted());
//        existing.setReminderEnabled(updated.isReminderEnabled());
//        return mapToDTO(taskRepo.save(existing));
//    }
//
//    @Override
//    @Transactional
//    public void deleteTaskForWedding(Long weddingId, Long id) {
//        Wedding wedding = weddingService.findById(weddingId)
//                .orElseThrow(() -> new RuntimeException("Wedding not found with ID: " + weddingId));
//        Task existing = taskRepo.findById(id)
//                .orElseThrow(() -> new RuntimeException("Task not found with ID: " + id));
//
//        if (!existing.getWedding().getId().equals(weddingId)) {
//            throw new RuntimeException("Task does not belong to the specified wedding.");
//        }
//        vendorService.unassignTaskFromAllVendors(id);
//        taskRepo.deleteById(id);
//    }
//
//    @Override
//    @Transactional
//    public void updateTaskCompletionForWedding(Long weddingId, Long taskId, boolean completed) {
//        Wedding wedding = weddingService.findById(weddingId)
//                .orElseThrow(() -> new RuntimeException("Wedding not found with ID: " + weddingId));
//        Task task = taskRepo.findById(taskId)
//                .orElseThrow(() -> new RuntimeException("Task not found with ID: " + taskId));
//
//        if (!task.getWedding().getId().equals(weddingId)) {
//            throw new RuntimeException("Task does not belong to the specified wedding.");
//        }
//
//        task.setCompleted(completed);
//        taskRepo.save(task);
//
//        task.getSubtasks().forEach(subtask -> {
//            subtask.setCompleted(completed);
//            subtaskRepo.save(subtask);
//        });
//
//        if (completed) {
//            vendorService.unassignTaskFromAllVendors(taskId);
//        }
//    }
//
//    @Override
//    @Transactional
//    public SubtaskDTO addSubtaskForWedding(Long weddingId, Long taskId, Subtask subtask) {
//        Wedding wedding = weddingService.findById(weddingId)
//                .orElseThrow(() -> new RuntimeException("Wedding not found with ID: " + weddingId));
//        Task task = taskRepo.findById(taskId)
//                .orElseThrow(() -> new RuntimeException("Task not found with ID: " + taskId));
//
//        if (!task.getWedding().getId().equals(weddingId)) {
//            throw new RuntimeException("Task does not belong to the specified wedding.");
//        }
//
//        subtask.setTask(task);
//        Subtask saved = subtaskRepo.save(subtask);
//        return new SubtaskDTO(saved.getId(), saved.getTitle(), saved.isCompleted());
//    }
//
//    @Override
//    @Transactional
//    public SubtaskDTO updateSubtaskForWedding(Long weddingId, Long taskId, Long subtaskId, Subtask updated) {
//        Wedding wedding = weddingService.findById(weddingId)
//                .orElseThrow(() -> new RuntimeException("Wedding not found with ID: " + weddingId));
//        Task task = taskRepo.findById(taskId)
//                .orElseThrow(() -> new RuntimeException("Task not found with ID: " + taskId));
//
//        if (!task.getWedding().getId().equals(weddingId)) {
//            throw new RuntimeException("Task does not belong to the specified wedding.");
//        }
//
//        Subtask existing = subtaskRepo.findById(subtaskId)
//                .orElseThrow(() -> new RuntimeException("Subtask not found with ID: " + subtaskId));
//        if (!existing.getTask().getId().equals(taskId)) {
//            throw new RuntimeException("Subtask does not belong to the specified task.");
//        }
//        if (!existing.getTask().getWedding().getId().equals(weddingId)) {
//            throw new RuntimeException("Subtask does not belong to the specified wedding.");
//        }
//        existing.setTitle(updated.getTitle());
//        existing.setCompleted(updated.isCompleted());
//        Subtask saved = subtaskRepo.save(existing);
//        return new SubtaskDTO(saved.getId(), saved.getTitle(), saved.isCompleted());
//    }
//
//    @Override
//    @Transactional
//    public void deleteSubtaskForWedding(Long weddingId, Long taskId, Long subtaskId) {
//        Wedding wedding = weddingService.findById(weddingId)
//                .orElseThrow(() -> new RuntimeException("Wedding not found with ID: " + weddingId));
//        Task task = taskRepo.findById(taskId)
//                .orElseThrow(() -> new RuntimeException("Task not found with ID: " + taskId));
//
//        if (!task.getWedding().getId().equals(weddingId)) {
//            throw new RuntimeException("Task does not belong to the specified wedding.");
//        }
//
//        Subtask existing = subtaskRepo.findById(subtaskId)
//                .orElseThrow(() -> new RuntimeException("Subtask not found with ID: " + subtaskId));
//        if (!existing.getTask().getId().equals(taskId)) {
//            throw new RuntimeException("Subtask does not belong to the specified task.");
//        }
//        if (!existing.getTask().getWedding().getId().equals(weddingId)) {
//            throw new RuntimeException("Subtask does not belong to the specified wedding.");
//        }
//        subtaskRepo.delete(existing);
//    }
//
//    @Override
//    public ProgressDTO getProgressForWedding(Long weddingId) {
//        weddingService.findById(weddingId)
//                .orElseThrow(() -> new RuntimeException("Wedding not found with ID: " + weddingId));
//        long total = taskRepo.countByWeddingId(weddingId);
//        long completed = taskRepo.countByWeddingIdAndCompleted(weddingId, true);
//        double percentage = total == 0 ? 0.0 : (completed * 100.0 / total);
//        return new ProgressDTO((int) completed, (int) total, percentage);
//    }
//
//    @Override
//    public List<OverdueReminderDTO> getOverdueRemindersForWedding(Long weddingId) {
//        weddingService.findById(weddingId)
//                .orElseThrow(() -> new RuntimeException("Wedding not found with ID: " + weddingId));
//        List<Task> overdue = taskRepo.findByWeddingIdAndReminderEnabledAndCompletedFalseAndDueDateBefore(weddingId, true, LocalDate.now());
//
//        return overdue.stream()
//                .filter(t -> t.getDueDate() != null)
//                .map(t -> {
//                    long daysOverdue = LocalDate.now().toEpochDay() - t.getDueDate().toEpochDay();
//                    return new OverdueReminderDTO(t.getTitle(), daysOverdue, t.getAssignee());
//                })
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    public Map<String, List<TaskDTO>> getTasksGroupedByPriorityForWedding(Long weddingId) {
//        weddingService.findById(weddingId)
//                .orElseThrow(() -> new RuntimeException("Wedding not found with ID: " + weddingId));
//        List<Task> tasks = taskRepo.findAllByWeddingId(weddingId);
//
//        Map<Priority, List<TaskDTO>> groupedEntities = tasks.stream()
//                .collect(Collectors.groupingBy(
//                        t -> t.getPriority() == null ? Priority.MEDIUM : t.getPriority(),
//                        Collectors.mapping(this::mapToDTO, Collectors.toList())
//                ));
//
//        Map<String, List<TaskDTO>> result = new LinkedHashMap<>();
//        result.put(Priority.HIGH.name(), groupedEntities.getOrDefault(Priority.HIGH, List.of()));
//        result.put(Priority.MEDIUM.name(), groupedEntities.getOrDefault(Priority.MEDIUM, List.of()));
//        result.put(Priority.LOW.name(), groupedEntities.getOrDefault(Priority.LOW, List.of()));
//
//        return result;
//    }
//
//    private TaskDTO mapToDTO(Task task) {
//        List<SubtaskDTO> subtasks = task.getSubtasks() == null
//                ? List.of()
//                : task.getSubtasks().stream()
//                .map(s -> new SubtaskDTO(s.getId(), s.getTitle(), s.isCompleted()))
//                .collect(Collectors.toList());
//
//        return new TaskDTO(
//                task.getId(),
//                task.getTitle(),
//                task.getDescription(),
//                task.getDueDate(),
//                task.getPriority(),
//                task.getAssignee(),
//                task.isCompleted(),
//                task.isReminderEnabled(),
//                subtasks
//        );
//    }
//}
