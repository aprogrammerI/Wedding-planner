//package com.yourcompany.wedding.weddingbackend.dto;
//
//import com.yourcompany.wedding.weddingbackend.model.Assignee;
//
//
//public record OverdueReminderDTO(
//    String title,
//    long daysOverdue,
//     Assignee assignee)
//
//
//     {
//
//     }

// src/main/java/com/yourcompany/wedding/weddingbackend/dto/OverdueReminderDTO.java
package com.yourcompany.wedding.weddingbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OverdueReminderDTO {
     private Long taskId;
     private String title;
     private String assignee;      // BRIDE | GROOM | PLANNER | OTHER
     private long daysOverdue;     // e.g. 603
     private LocalDate dueDate;    // optional but handy
}

