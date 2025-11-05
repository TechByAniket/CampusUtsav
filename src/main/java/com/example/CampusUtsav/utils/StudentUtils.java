package com.example.CampusUtsav.utils;

import com.example.CampusUtsav.dtos.CollegeRegistrationRequest;
import com.example.CampusUtsav.dtos.StudentRegistrationRequest;
import com.example.CampusUtsav.entity.Branch;
import com.example.CampusUtsav.entity.College;
import com.example.CampusUtsav.entity.Student;
import org.springframework.stereotype.Component;

@Component
public class StudentUtils {
    public String generateStudentUsername(StudentRegistrationRequest request, College college, Branch branch) {
        String firstName = request.getName().split(" ")[0].toLowerCase();
        String branchShortForm = branch.getShortForm().toUpperCase();
        String collegeShortForm = college.getShortForm().toUpperCase();
        String idNum = request.getIdentificationNumber();
        int year = request.getAdmissionYear();

        return firstName + "@" + branchShortForm + "-" + collegeShortForm + "-" + idNum;
    }
}
