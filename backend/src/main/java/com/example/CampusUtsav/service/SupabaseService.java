package com.example.CampusUtsav.service;

import org.springframework.web.multipart.MultipartFile;

public interface SupabaseService {

    public String uploadFile(MultipartFile file);
    public String getPublicUrl(String fileName);
//    public boolean deleteFile(String fileName);
}
