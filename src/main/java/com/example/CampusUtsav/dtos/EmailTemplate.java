package com.example.CampusUtsav.dtos;

import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Builder
@Data
@RequiredArgsConstructor
public class EmailTemplate {

    private String recipientName;

    private String title;

    private String message;

    private String buttonText;

    private String buttonUrl;

    private String entityName;

    private String remarks;
}