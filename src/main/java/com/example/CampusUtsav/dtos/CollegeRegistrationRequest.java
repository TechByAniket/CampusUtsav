package com.example.CampusUtsav.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CollegeRegistrationRequest {

    @NotBlank(message = "College name is required")
    private String name;

    @NotBlank(message = "College name short form is required")
    private String shortForm;

    @NotBlank(message = "College admin name is required")
    private String adminName;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "District is required")
    private String district;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Website URL is required")
    @Size(max = 255, message = "Website URL too long")
    private String websiteUrl;

    @NotBlank(message = "Affiliation status is required")
    private String affiliation;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be 10 digits")
    private String phone;

    @NotBlank(message = "Password is required")
    private String password; // plaintext for registration

    private String logoUrl;

}