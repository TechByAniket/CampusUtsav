package com.example.CampusUtsav.controller;

import com.example.CampusUtsav.dtos.LoginRequest;
import com.example.CampusUtsav.dtos.LoginResponse;
import com.example.CampusUtsav.entity.enums.AccountStatus;
import com.example.CampusUtsav.entity.enums.Role;
import com.example.CampusUtsav.security.jwt.JwtUtils;
import com.example.CampusUtsav.security.service.CustomUserDetailsService;
import com.example.CampusUtsav.service.AuthService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@AllArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request){
        return authService.login(request);
    }
    //  Takes email and password
//  Checks password with PasswordEncoder.matches()
//  Generates JWT token
//  Returns { token, role, email }


    @GetMapping("/roles")
    public ResponseEntity<List<String>> getAvailableRoles(){
        List<String> roles = Arrays.stream(Role.values())
                .map(Enum::name)
                .collect(Collectors.toList());
        return ResponseEntity.status(HttpStatus.OK).body(roles);
    }

    @GetMapping("/account-statuses")
    public ResponseEntity<List<String>> getAccountStatuses() {
        List<String> statuses = Arrays.stream(AccountStatus.values())
                .map(Enum::name)
                .collect(Collectors.toList());
        return ResponseEntity.status(HttpStatus.OK).body(statuses);
    }
}


