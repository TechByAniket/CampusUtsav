package com.example.CampusUtsav.security.jwt;

import com.example.CampusUtsav.entity.enums.Role;
import com.example.CampusUtsav.repository.StaffRepository;
import com.example.CampusUtsav.security.model.CustomUserDetails;
import com.example.CampusUtsav.security.service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;


@Component
@AllArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private final JwtUtils jwtUtils;
    private final CustomUserDetailsService customUserDetailsService;
    private final StaffRepository staffRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws IOException, ServletException {

        //  1. Handle preflight FIRST
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String authHeader = request.getHeader("Authorization");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {

                String token = authHeader.substring(7);

                if (!token.isEmpty()
                        && !token.equalsIgnoreCase("undefined")
                        && !token.equalsIgnoreCase("null")) {

                    if (jwtUtils.validateJwtToken(token)) {

                        String email = jwtUtils.getUsernameFromJwtToken(token);
                        Integer collegeIdFromToken = jwtUtils.getCollegeIdFromJwtToken(token);
                        String role = jwtUtils.getRoleFromJwtToken(token);
                        Integer profileId = jwtUtils.getProfileIdFromJwtToken(token);

                        CustomUserDetails userDetails =
                                (CustomUserDetails) customUserDetailsService.loadUserByUsername(email);

                        String status = "ACTIVE";
                        if ("ROLE_FACULTY".equals(role) || "ROLE_HOD".equals(role)) {
                            status = staffRepository.findByUser_Email(email)
                                    .map(staff -> staff.getStatus().name())
                                    .orElse("DEACTIVATED");
                        }

                        CustomUserDetails principal =
                                new CustomUserDetails(userDetails.getUser(), collegeIdFromToken, status, profileId);

                        if (principal.isEnabled()) {
                            UsernamePasswordAuthenticationToken authentication =
                                    new UsernamePasswordAuthenticationToken(
                                            principal,
                                            null,
                                            principal.getAuthorities()
                                    );

                            SecurityContextHolder.getContext().setAuthentication(authentication);
                        }
                    }
                }
            }

        } catch (Exception e) {
            logger.error("JWT auth error: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

//  Intercepts every request
//  Validates JWT → extracts user
//  Sets Authentication in SecurityContext → Spring Security aware of user and roles