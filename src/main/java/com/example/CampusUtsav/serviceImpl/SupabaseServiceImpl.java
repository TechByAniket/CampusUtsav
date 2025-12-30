package com.example.CampusUtsav.serviceImpl;

import com.example.CampusUtsav.service.SupabaseService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.UUID;

@Service
public class SupabaseServiceImpl implements SupabaseService {

    @Value("${supabase.bucket}")
    private String bucketName;

    @Value("${supabase.url}")
    private String supabaseUrl;

    private final WebClient webClient;

    public SupabaseServiceImpl(WebClient webClient) {
        this.webClient = webClient;
    }

    @Override
    public String uploadFile(MultipartFile file) {
        try {
            String originalName = file.getOriginalFilename();
            String extension = "";

            if (originalName != null && originalName.contains(".")) {
                extension = originalName.substring(originalName.lastIndexOf("."));
            }

            String key = UUID.randomUUID() + extension;

            webClient.post()
                    .uri("/object/" + bucketName + "/" + key)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .bodyValue(file.getBytes())
                    .retrieve()
                    .toBodilessEntity()
                    .block();

            return getPublicUrl(key);

        } catch (WebClientResponseException e) {
            // This logs the HTTP status and body from Supabase
            System.err.println("HTTP Status: " + e.getRawStatusCode());
            System.err.println("Response body: " + e.getResponseBodyAsString());
            throw new RuntimeException("Failed to upload file to Supabase: " + e.getResponseBodyAsString(), e);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to upload file to Supabase", e);
        }
    }




    @Override
    public String getPublicUrl(String fileName) {
        // Public URL format for Supabase Storage
        return supabaseUrl + "/storage/v1/object/public/" + bucketName + "/" + fileName;
    }

//    @Override
//    public boolean deleteFile(String filename) {
//        try {
//            webClient.delete()
//                    .uri("/object/" + bucketName + "/" + filename)
//                    .retrieve()
//                    .toBodilessEntity()
//                    .block(); // This will throw an exception on failure (e.g., 4xx or 5xx status)
//
//            return true; // Return true if the .block() call completes without an exception
//
//        } catch (WebClientResponseException e) {
//            // It's good practice to log the error so you know why it failed
//            // A proper logger like SLF4J is recommended over System.err
//            System.err.println("Failed to delete file '" + filename + "'. Status: " + e.getStatusCode());
//
//            return false; // Return false because an exception occurred
//        }
//    }
}
