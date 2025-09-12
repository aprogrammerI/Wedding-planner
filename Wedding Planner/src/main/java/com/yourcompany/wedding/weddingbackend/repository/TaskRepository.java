package com.yourcompany.wedding.weddingbackend.repository;

import com.yourcompany.wedding.weddingbackend.model.Assignee;
import com.yourcompany.wedding.weddingbackend.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    // find tasks assigned to a specific person (enum Assignee)
    List<Task> findByAssignee(Assignee assignee);

    // find tasks with reminders enabled, not completed, and due before given date (used for overdue reminders)
    List<Task> findByReminderEnabledAndCompletedFalseAndDueDateBefore(boolean reminderEnabled, LocalDate date);

    // find tasks by completion state (used to compute progress)
    List<Task> findByCompleted(boolean completed);
}