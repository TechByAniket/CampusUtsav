package com.example.CampusUtsav.ai;

import com.example.CampusUtsav.dtos.AiPromptRequest;
import com.example.CampusUtsav.ai.AiService;
import org.springframework.stereotype.Service;

@Service
public class AiServiceImpl implements AiService {

    private final GeminiClientService geminiClientService;

    public AiServiceImpl(GeminiClientService geminiClientService) {
        this.geminiClientService = geminiClientService;
    }

    @Override
    public String generateResponse(AiPromptRequest userPrompt) { // Ensure types match your DTO
        // Assuming userPrompt has getTone(), getMaxLength(), and getPrompt()
        // Replace with your actual DTO class name

        String systemPrompt = """
        You are a professional event content writer.
        Write event descriptions in Markdown.
        Use bullet points and bold highlights.
        """;

        String finalPrompt = String.format(
                "%s\n\nTone: Professional\nWord limit: 200\n\nUser request:\n%s",
                systemPrompt,
                userPrompt.toString()
        );

        return geminiClientService.generateMarkdown(finalPrompt);
    }
}