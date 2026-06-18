package com.example.CampusUtsav.dtos.miniDtos;

import com.example.CampusUtsav.entity.Student;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StudentSummary {
    private Integer id;
    private String name;
    private String gender;
    private String identificationNumber;
    private String email;
    private String phone;
    private int rollNo;
    private int year;
    private String division;
    private String branch;
    private Integer collegeId;
}
