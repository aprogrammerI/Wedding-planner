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

    List<TaskDTO> getAllTasks();

    List<TaskDTO> getTasksByAssignee(Assignee assignee);

    TaskDTO createTask(Task task);

    TaskDTO updateTask(Long id, Task updated);

    void deleteTask(Long id);

    void updateTaskCompletion(Long taskId, boolean completed);

    SubtaskDTO addSubtask(Long taskId, Subtask subtask);

    SubtaskDTO updateSubtask(Long taskId, Long subtaskId, Subtask updated);

    void deleteSubtask(Long taskId, Long subtaskId);

    ProgressDTO getProgress();

    List<OverdueReminderDTO> getOverdueReminders();

    Map<String, List<TaskDTO>> getTasksGroupedByPriority();
}