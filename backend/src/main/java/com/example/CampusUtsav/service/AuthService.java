package com.example.CampusUtsav.service;

import com.example.CampusUtsav.dtos.LoginRequest;
import com.example.CampusUtsav.dtos.LoginResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request);
}
