package com.yourcompany.wedding.weddingbackend.service;

import com.yourcompany.wedding.weddingbackend.dto.OverdueReminderDTO;
import com.yourcompany.wedding.weddingbackend.dto.ProgressDTO;
import com.yourcompany.wedding.weddingbackend.dto.SubtaskDTO;
import com.yourcompany.wedding.weddingbackend.dto.TaskDTO;
import com.yourcompany.wedding.weddingbackend.model.Assignee;
import com.yourcompany.wedding.weddingbackend.model.Subtask;
import com.yourcompany.wedding.weddingbackend.model.Task;

import java.util.List;
import java.util.Map;

public interface TaskService {
    List<TaskDTO> getAllTasks(Long userId);
    List<TaskDTO> getTasksByAssignee(Long userId, Assignee assignee);

    TaskDTO createTask(Long userId, Task task);
    TaskDTO updateTask(Long userId, Long id, Task updated);
    void deleteTask(Long userId, Long id);

    SubtaskDTO addSubtask(Long userId, Long taskId, Subtask subtask);
    SubtaskDTO updateSubtask(Long userId, Long taskId, Long subtaskId, Subtask updated);
    void deleteSubtask(Long userId, Long taskId, Long subtaskId);

    void updateTaskCompletion(Long userId, Long taskId, boolean completed);

    ProgressDTO getProgress(Long userId);
    List<OverdueReminderDTO> getOverdueReminders(Long userId);
    Map<String, List<TaskDTO>> getTasksGroupedByPriority(Long userId);



}