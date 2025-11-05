package com.example.CampusUtsav.dtos;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.URL;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ClubRegistrationRequest {

    @NotBlank(message = "Club/Committee/Society/Chapter name is required")
    private String name;

    @NotBlank(message = "Admin name is required")
    private String adminName;

    @NotBlank(message = "Short form of club name required")
    private String shortForm;

    @NotBlank(message = "Faculty coordinator name is required")
    private String facultyCoordinatorName;

    @NotBlank(message = "Faculty coordinator email is required")
    @Email(message = "Invalid email format")
    private String facultyCoordinatorEmail;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Admin email is required")
    private String adminEmail;

    //    @Column(unique = true)
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be 10 digits")
    @NotBlank(message = "Phone number (Admin) is required")
    private String adminPhone;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Club description is required")
    @Size(max = 1500)
    private String description;

    @URL(message = "Invalid URL format")
    private String logoUrl;

    @NotBlank(message = "Website URL is required")
    @Size(max = 255, message = "Website URL too long")
    @URL(message = "Invalid URL format")
    private String websiteUrl;

    @NotBlank(message = "Website URL is required")
    @Size(max = 255, message = "Instagram URL too long")
    @URL(message = "Invalid URL format")
    private String instagramUrl;
}
