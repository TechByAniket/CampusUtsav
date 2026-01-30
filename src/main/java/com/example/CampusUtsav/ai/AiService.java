package com.example.CampusUtsav.ai;

import com.example.CampusUtsav.dtos.AiPromptRequest;

public interface AiService {
    String generateResponse(AiPromptRequest userPrompt);
}
