package com.example.CampusUtsav.security.service;
import com.example.CampusUtsav.entity.User;
import com.example.CampusUtsav.repository.UserRepository;
import com.example.CampusUtsav.security.model.CustomUserDetails;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(()-> new UsernameNotFoundException("User not found with email : " + email));
        return new CustomUserDetails(user);
    }
}

//  Spring Security needs to load the user by username (email) during login.
//  This service will provide that.
//  Spring Security automatically calls this during authentication
//  Returns CustomUserDetails → which includes password + role info
