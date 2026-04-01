package com.example.CampusUtsav.dtos;

import com.example.CampusUtsav.entity.Branch;
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
    @Column(length = 20)
    private String shortForm;

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
    private String description;

    private Integer branchId;

    @Size(message = "Website URL too long")
    private String websiteUrl;

    @NotBlank(message = "Instagram URL is required")
    @Size(message = "Instagram URL too long")
    private String instagramUrl;
    private String linkedInUrl;

}
