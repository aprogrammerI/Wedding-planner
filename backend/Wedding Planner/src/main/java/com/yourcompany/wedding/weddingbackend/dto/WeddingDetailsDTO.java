package com.yourcompany.wedding.weddingbackend.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeddingDetailsDTO {
    private Long id;
    private String brideFirstName;
    private String brideLastName;
    private Integer brideAge;
    private String groomFirstName;
    private String groomLastName;
    private Integer groomAge;
    private LocalDate weddingDate;
    private String weddingLocation;
}
