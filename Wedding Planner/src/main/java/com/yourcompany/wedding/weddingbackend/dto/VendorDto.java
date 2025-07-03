package com.yourcompany.wedding.weddingbackend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VendorDto {
    private Long id;
    private String name;
    private String serviceType;
    private String contactInfo;
    private Long weddingId;
}
