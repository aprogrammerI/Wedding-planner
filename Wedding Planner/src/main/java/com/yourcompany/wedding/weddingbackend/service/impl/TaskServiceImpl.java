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
    public List<TaskDTO> getAllTasks(Long userId) {
        return taskRepo.findByOwnerId(userId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskDTO> getTasksByAssignee(Long userId, Assignee assignee) {
        return taskRepo.findByOwnerIdAndAssignee(userId, assignee).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TaskDTO createTask(Long userId, Task task) {
        task.setOwnerId(userId);
        Task saved = taskRepo.save(task);
        return mapToDTO(saved);
    }

//    @Override
//    @Transactional
//    public TaskDTO updateTask(Long userId, Long id, Task updated) {
//        Task existing = taskRepo.findById(id)
//                .orElseThrow(() -> new RuntimeException("Task not found"));
//        if (!userId.equals(existing.getOwnerId())) {
//            throw new RuntimeException("Forbidden");
//        }
//
//        existing.setTitle(updated.getTitle());
//        existing.setDescription(updated.getDescription());
//        existing.setDueDate(updated.getDueDate());
//        existing.setPriority(updated.getPriority());
//        existing.setAssignee(updated.getAssignee());
//        existing.setCompleted(updated.isCompleted());
//        existing.setReminderEnabled(updated.isReminderEnabled());
//
//        return mapToDTO(taskRepo.save(existing));
//    }

    @Override
    @Transactional
    public TaskDTO updateTask(Long userId, Long id, Task updated) {
        Task existing = taskRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        if (!userId.equals(existing.getOwnerId())) {
            throw new RuntimeException("Forbidden");
        }

        boolean wasCompleted = existing.isCompleted();

        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setDueDate(updated.getDueDate());
        existing.setPriority(updated.getPriority());
        existing.setAssignee(updated.getAssignee());
        existing.setCompleted(updated.isCompleted());
        existing.setReminderEnabled(updated.isReminderEnabled());

        Task saved = taskRepo.save(existing);

        if (!wasCompleted && saved.isCompleted()) {
            vendorService.unassignTaskFromAllVendors(saved.getId());
        }

        return mapToDTO(saved);
    }

    @Override
    @Transactional
    public void deleteTask(Long userId, Long id) {
        Task existing = taskRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        if (!userId.equals(existing.getOwnerId())) {
            throw new RuntimeException("Forbidden");
        }

        vendorService.unassignTaskFromAllVendors(id);
        taskRepo.deleteById(id);
    }

    @Override
    @Transactional
    public SubtaskDTO addSubtask(Long userId, Long taskId, Subtask subtask) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        if (!userId.equals(task.getOwnerId())) {
            throw new RuntimeException("Forbidden");
        }
        subtask.setTask(task);
        Subtask saved = subtaskRepo.save(subtask);
        return new SubtaskDTO(saved.getId(), saved.getTitle(), saved.isCompleted());
    }

    @Override
    @Transactional
    public SubtaskDTO updateSubtask(Long userId, Long taskId, Long subtaskId, Subtask updated) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        if (!userId.equals(task.getOwnerId())) {
            throw new RuntimeException("Forbidden");
        }

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
    public void deleteSubtask(Long userId, Long taskId, Long subtaskId) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        if (!userId.equals(task.getOwnerId())) {
            throw new RuntimeException("Forbidden");
        }

        Subtask existing = subtaskRepo.findById(subtaskId)
                .orElseThrow(() -> new RuntimeException("Subtask not found"));
        if (!existing.getTask().getId().equals(taskId)) {
            throw new RuntimeException("Subtask does not belong to the given task");
        }
        subtaskRepo.delete(existing);
    }

    @Override
    @Transactional
    public void updateTaskCompletion(Long userId, Long taskId, boolean completed) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        if (!userId.equals(task.getOwnerId())) {
            throw new RuntimeException("Forbidden");
        }

        task.setCompleted(completed);
        taskRepo.save(task);

        task.getSubtasks().forEach(subtask -> {
            subtask.setCompleted(completed);
            subtaskRepo.save(subtask);
        });

        if (completed) {
            vendorService.unassignTaskFromAllVendors(taskId);
        }
    }

    @Override
    public ProgressDTO getProgress(Long userId) {
        int total = taskRepo.findByOwnerId(userId).size();
        int completed = taskRepo.findByOwnerIdAndCompleted(userId, true).size();
        double percentage = total == 0 ? 0.0 : (completed * 100.0 / total);
        return new ProgressDTO(completed, total, percentage);
    }

//    @Override
//    public List<OverdueReminderDTO> getOverdueReminders(Long userId) {
//        return taskRepo.findByOwnerIdAndReminderEnabledAndCompletedFalseAndDueDateBefore(
//                        userId, true, LocalDate.now())
//                .stream()
//                .filter(t -> t.getDueDate() != null)
//                .map(t -> {
//                    long daysOverdue = LocalDate.now().toEpochDay() - t.getDueDate().toEpochDay();
//                    return new OverdueReminderDTO(t.getTitle(), daysOverdue, t.getAssignee());
//                })
//                .collect(Collectors.toList());
//    }


    @Override
    public List<OverdueReminderDTO> getOverdueReminders(Long userId) {
        LocalDate today = LocalDate.now();
        return taskRepo.findByOwnerIdAndReminderEnabledAndCompletedFalseAndDueDateBefore(userId, true, today)
                .stream()
                .filter(t -> t.getDueDate() != null)
                .map(t -> OverdueReminderDTO.builder()
                        .taskId(t.getId())
                        .title(t.getTitle())
                        .assignee(t.getAssignee() == null ? null : t.getAssignee().name())
                        .daysOverdue(today.toEpochDay() - t.getDueDate().toEpochDay())
                        .dueDate(t.getDueDate())
                        .build())
                .toList();
    }

    @Override
    public Map<String, List<TaskDTO>> getTasksGroupedByPriority(Long userId) {
        List<Task> tasks = taskRepo.findByOwnerId(userId);

        Map<Priority, List<TaskDTO>> groupedEntities = tasks.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getPriority() == null ? Priority.MEDIUM : t.getPriority(),
                        Collectors.mapping(this::mapToDTO, Collectors.toList())
                ));

        Map<String, List<TaskDTO>> result = new LinkedHashMap<>();
        result.put(Priority.HIGH.name(), groupedEntities.getOrDefault(Priority.HIGH, List.of()));
        result.put(Priority.MEDIUM.name(), groupedEntities.getOrDefault(Priority.MEDIUM, List.of()));
        result.put(Priority.LOW.name(), groupedEntities.getOrDefault(Priority.LOW, List.of()));
        return result;
    }

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