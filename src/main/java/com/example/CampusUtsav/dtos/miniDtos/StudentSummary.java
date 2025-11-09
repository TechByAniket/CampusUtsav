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
    private int rollNo;
    private int year;
    private String division;
    private String branch;

    public static StudentSummary from(Student student){
        if(student == null) return null;
        return StudentSummary.builder()
                .id(student.getId())
                .name(student.getName())
                .gender(student.getGender())
                .identificationNumber(student.getIdentificationNumber())
                .email(student.getEmail())
                .rollNo(student.getRollNo())
                .year(student.getYear())
                .division(student.getDivision())
                .branch(student.getBranch().getShortForm())
                .build();
    }
}
