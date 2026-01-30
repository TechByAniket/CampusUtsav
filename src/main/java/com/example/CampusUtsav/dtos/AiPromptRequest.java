package com.example.CampusUtsav.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AiPromptRequest {
    private String prompt;
    private String tone;
    private Integer maxLength;
}
