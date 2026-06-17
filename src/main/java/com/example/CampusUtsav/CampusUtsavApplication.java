package com.example.CampusUtsav;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class CampusUtsavApplication {

	public static void main(String[] args) {
		SpringApplication.run(CampusUtsavApplication.class, args);
	}

}
