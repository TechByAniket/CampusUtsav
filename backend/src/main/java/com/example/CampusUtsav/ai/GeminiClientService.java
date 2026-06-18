package com.example.CampusUtsav.ai;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class GeminiClientService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final WebClient webClient;

    public GeminiClientService(@Qualifier("geminiWebClient") WebClient webClient) {
        this.webClient = webClient;
    }

    public String generateMarkdown(String prompt) {
        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", prompt)))
                )
        );

        // Using a formatted String avoids URI encoding issues with the colon ':'
        String endpoint = String.format("/v1beta/models/gemini-1.5-flash:generateContent?key=%s", apiKey);

        return webClient.post()
                .uri(endpoint)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .map(json -> json.at("/candidates/0/content/parts/0/text").asText())
                .block(); // For production, consider using non-blocking subscribe/Mono
    }
}