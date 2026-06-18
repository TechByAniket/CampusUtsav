package com.example.CampusUtsav.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/test")
public class TestController {

    @GetMapping
    public String hello() {
        return "Hello, World!";
    }
}
