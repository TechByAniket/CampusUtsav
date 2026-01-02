package com.example.CampusUtsav.dtos;

import com.example.CampusUtsav.entity.Branch;
import jakarta.persistence.ElementCollection;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.URL;

import java.util.List;
import java.util.Set;

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

//    @URL(message = "Invalid URL format")
//    private String logoUrl;

    @ElementCollection
    @NotEmpty(message = "At least one official domain is required")
    private Set< @Pattern(
            regexp = "^[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
            message = "Invalid domain format"
    ) String> officialDomains;

    @ElementCollection
    @NotEmpty(message = "At least one branch is required")
    private List<String> branches;
}