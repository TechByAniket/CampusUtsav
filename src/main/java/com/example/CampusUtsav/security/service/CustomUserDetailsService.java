package com.example.CampusUtsav.security.service;
import com.example.CampusUtsav.entity.Staff;
import com.example.CampusUtsav.entity.User;
import com.example.CampusUtsav.entity.enums.Role;
import com.example.CampusUtsav.repository.StaffRepository;
import com.example.CampusUtsav.repository.UserRepository;
import com.example.CampusUtsav.security.model.CustomUserDetails;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final StaffRepository staffRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // 1. Default status 'ACTIVE' for all other than staff.
        String currentStatus = "ACTIVE";

        // 2. If User is HOD/FACULTY , just fetch their status from staff table
        if (user.getRole() == Role.ROLE_FACULTY || user.getRole() == Role.ROLE_HOD) {
            Optional<Staff> staff = staffRepository.findByUser_Id(user.getId());
            if (staff.isPresent()) {
                currentStatus = staff.get().getStatus().name();
            }
        }
        return new CustomUserDetails(user, null, currentStatus);
    }
}

//  Spring Security needs to load the user by username (email) during login.
//  This service will provide that.
//  Spring Security automatically calls this during authentication
//  Returns CustomUserDetails → which includes password + role info
