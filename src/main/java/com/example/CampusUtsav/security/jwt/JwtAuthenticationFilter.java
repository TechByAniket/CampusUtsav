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
                                    FilterChain filterChain) throws IOException, ServletException {

        try {
            String authHeader = request.getHeader("Authorization");

            // 1. Tight Validation for Header and Token
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);

                // Extra Check: Frontend agar "undefined" ya "null" bhej de
                if (!token.isEmpty() && !token.equalsIgnoreCase("undefined") && !token.equalsIgnoreCase("null")) {

                    if (jwtUtils.validateJwtToken(token)) {
                        String email = jwtUtils.getUsernameFromJwtToken(token);
                        Integer collegeIdFromToken = jwtUtils.getCollegeIdFromToken(token);
                        String role = jwtUtils.getRoleFromJwtToken(token);

                        // 2. Performance Tip: loadUserByUsername ki jagah seedha User object nikal sakte ho
                        // ya fir userDetails ko filter logic mein reuse karo.
                        CustomUserDetails userDetails = (CustomUserDetails) customUserDetailsService.loadUserByUsername(email);

                        String status = "ACTIVE";
                        if ("ROLE_FACULTY".equals(role) || "ROLE_HOD".equals(role)) {
                            status = staffRepository.findByUser_Email(email)
                                    .map(staff -> staff.getStatus().name())
                                    .orElse("DEACTIVATED");
                        }

                        CustomUserDetails principal = new CustomUserDetails(userDetails.getUser(), collegeIdFromToken, status);

                        // 3. 🛡️ The Most Important Check: Only authenticate if ENABLED
                        if (principal.isEnabled()) {
                            UsernamePasswordAuthenticationToken authentication =
                                    new UsernamePasswordAuthenticationToken(
                                            principal,
                                            null,
                                            principal.getAuthorities()
                                    );
                            SecurityContextHolder.getContext().setAuthentication(authentication);
                        } else {
                            // Agar account pending/suspended hai, toh context set mat karo
                            // Isse Spring Security automatically 403/401 return kar degi
                            logger.warn("User {} is blocked due to status: {}", email, status);
                        }
                    }
                }
            }
        } catch (Exception e) {
            // Kisi bhi JWT parsing error par crash mat hone do, bas log karo
            logger.error("Cannot set user authentication: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}

//  Intercepts every request
//  Validates JWT → extracts user
//  Sets Authentication in SecurityContext → Spring Security aware of user and roles