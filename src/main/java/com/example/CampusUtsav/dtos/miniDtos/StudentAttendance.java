package com.example.CampusUtsav.dtos.miniDtos;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Builder
@Data
public class StudentAttendance {

    private Integer studentId;
    private String name;
    private String branch;
    private Integer year;
    private String div;
    private String identificationNumber;
    private Integer rollNo;
    private boolean present;
    private LocalDateTime markedAt;
}
