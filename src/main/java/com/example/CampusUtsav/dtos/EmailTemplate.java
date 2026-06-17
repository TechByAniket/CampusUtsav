package com.example.CampusUtsav.dtos;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class EmailTemplate {

    private String recipientName;

    private String title;

    private String message;

    private String buttonText;

    private String buttonUrl;

    private String entityName;

    private String remarks;
}