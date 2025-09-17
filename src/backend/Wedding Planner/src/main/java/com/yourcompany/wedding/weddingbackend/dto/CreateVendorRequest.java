package com.yourcompany.wedding.weddingbackend.dto;

public record CreateVendorRequest(
        String name,
        String category,
        String phone,
        String email,
        String website
) {}
