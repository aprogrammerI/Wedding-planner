package com.yourcompany.wedding.weddingbackend.model;

import lombok.*;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "expenses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Expense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String category;
    private BigDecimal amount;

    @ManyToOne
    @JoinColumn(name = "wedding_id")
    private Wedding wedding;
}