package com.example.CampusUtsav.controller;

import com.example.CampusUtsav.dtos.LoginRequest;
import com.example.CampusUtsav.dtos.LoginResponse;
import com.example.CampusUtsav.security.jwt.JwtUtils;
import com.example.CampusUtsav.security.service.CustomUserDetailsService;
import com.example.CampusUtsav.service.AuthService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request){
        return authService.login(request);
    }
}

//  Takes email and password
//  Checks password with PasswordEncoder.matches()
//  Generates JWT token
//  Returns { token, role, email }
