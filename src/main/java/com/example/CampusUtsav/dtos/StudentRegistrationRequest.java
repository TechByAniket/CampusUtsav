package com.example.CampusUtsav.dtos;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StudentRegistrationRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotBlank(message = "Unique identification number is required")
    private String identificationNumber;

    @NotBlank(message = "Student email is required")
    @Email(message = "Invalid email format")
    private String email;

    @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be 10 digits")
    private String phone;

    @NotBlank(message = "Password is required")
    private String password; // plaintext during registration

    @NotNull(message = "Roll number is required")
//    @Pattern(regexp = "^[A-Za-z0-9-]+$", message = "Invalid roll number format")
    private int rollNo;

    @Min(value = 1, message = "Year must be at least 1")
    @Max(value = 4, message = "Year cannot exceed 4")
    private int year;

    @NotBlank(message = "Division is required")
    @Pattern(regexp = "^[A-Za-z]+$", message = "Division must contain only letters")
    private String division;

    @Min(value = 2000, message = "Admission year must be valid")
    @Max(value = 2100, message = "Admission year must be valid")
    private int admissionYear;

    @Min(value = 2000, message = "Graduation year must be valid")
    @Max(value = 2100, message = "Graduation year must be valid")
    private int graduationYear;

    private String skills;
    private String interests;

    @NotNull(message = "College ID is required")
    private Integer collegeId;

    @NotNull(message = "Branch ID is required")
    private Integer branchId;
}
