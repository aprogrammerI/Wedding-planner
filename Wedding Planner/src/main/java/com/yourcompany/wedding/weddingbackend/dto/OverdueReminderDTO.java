package com.yourcompany.wedding.weddingbackend.dto;

import com.yourcompany.wedding.weddingbackend.model.Assignee;


public record OverdueReminderDTO(
    String title, 
    long daysOverdue,
     Assignee assignee)

     
     {
        
     }
