package com.example.CampusUtsav.security.model;

import com.example.CampusUtsav.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@AllArgsConstructor
public class CustomUserDetails implements UserDetails {

    private final User user;

    @Getter
    private final Integer collegeId;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities(){
        // spring expects ROLE_ prefix
        return Collections.singleton(new SimpleGrantedAuthority(user.getRole().name()));
    }

    public Long getId(){
        return user.getId();
    }

    @Override
    public String getPassword(){
        return user.getPasswordHash();
    }

    @Override
    public String getUsername(){
        return user.getEmail();
    }

    public Long getReferenceId(){
        return user.getReferenceId();
    }

    // Optionals
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}


//  UserDetails standard interface for Spring Security
//  getAuthorities() → RBAC / role-based security
//  getUsername() & getPassword() → login validation