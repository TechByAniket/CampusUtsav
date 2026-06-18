package com.example.CampusUtsav.security.utils;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class PasswordEncoderConfig {
    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}

//  PasswordEncoder is an interface and BCryptPasswordEncoder is an implementation class.
//  BcryptPasswordEncoder is the class that implements PasswordEncoder interface