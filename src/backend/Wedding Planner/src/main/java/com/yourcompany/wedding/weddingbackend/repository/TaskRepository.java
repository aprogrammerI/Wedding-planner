package com.yourcompany.wedding.weddingbackend.repository;

import com.yourcompany.wedding.weddingbackend.model.Assignee;
import com.yourcompany.wedding.weddingbackend.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {


    List<Task> findByOwnerId(Long ownerId);

    List<Task> findByOwnerIdAndAssignee(Long ownerId, Assignee assignee);

    List<Task> findByOwnerIdAndReminderEnabledAndCompletedFalseAndDueDateBefore(
            Long ownerId, boolean reminderEnabled, LocalDate date
    );

    List<Task> findByOwnerIdAndCompleted(Long ownerId, boolean completed);
}