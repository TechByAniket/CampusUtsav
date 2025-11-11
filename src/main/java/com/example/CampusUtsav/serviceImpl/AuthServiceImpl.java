package com.example.CampusUtsav.serviceImpl;

import com.example.CampusUtsav.dtos.LoginRequest;
import com.example.CampusUtsav.dtos.LoginResponse;
import com.example.CampusUtsav.entity.User;
import com.example.CampusUtsav.repository.UserRepository;
import com.example.CampusUtsav.security.jwt.JwtUtils;
import com.example.CampusUtsav.security.service.CustomUserDetailsService;
import com.example.CampusUtsav.service.AuthService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final CustomUserDetailsService customUserDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;

    @Override
    public LoginResponse login(LoginRequest request) {
        UserDetails user = customUserDetailsService.loadUserByUsername(request.getEmail());

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String role = user.getAuthorities().iterator().next().getAuthority();
        String token = jwtUtils.generateJwtToken(user.getUsername(), role);

        return new LoginResponse(user.getUsername(), role, token);
    }
}
