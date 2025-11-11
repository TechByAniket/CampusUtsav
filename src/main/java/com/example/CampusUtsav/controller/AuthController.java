package com.example.CampusUtsav.controller;

import com.example.CampusUtsav.dtos.LoginRequest;
import com.example.CampusUtsav.dtos.LoginResponse;
import com.example.CampusUtsav.security.jwt.JwtUtils;
import com.example.CampusUtsav.security.service.CustomUserDetailsService;
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

    private final CustomUserDetailsService customUserDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request){
        UserDetails user = customUserDetailsService.loadUserByUsername(request.getEmail());

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())){
            throw new RuntimeException("Invalid email or Password");
        }

        String role = user.getAuthorities().iterator().next().getAuthority();
        String token = jwtUtils.generateJwtToken(user.getUsername(), role);

        return new LoginResponse(user.getUsername(), role, token);
    }
}

//  Takes email and password
//  Checks password with PasswordEncoder.matches()
//  Generates JWT token
//  Returns { token, role, email }
