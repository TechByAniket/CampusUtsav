package com.example.CampusUtsav.mapper;

import com.example.CampusUtsav.dtos.StudentRegistrationRequest;
import com.example.CampusUtsav.dtos.StudentResponse;
import com.example.CampusUtsav.dtos.miniDtos.StudentSummary;
import com.example.CampusUtsav.entity.Branch;
import com.example.CampusUtsav.entity.College;
import com.example.CampusUtsav.entity.Student;
import org.springframework.stereotype.Component;

@Component
public class StudentMapper {

    public Student convertToStudentEntity(StudentRegistrationRequest req, College linkedCollege, Branch branch) {
        return Student.builder()
                .name(req.getName())
                .gender(req.getGender())
                .identificationNumber(req.getIdentificationNumber().trim().toUpperCase())
                .email(req.getEmail())
                .phone(req.getPhone())
                .passwordHash(req.getPassword())
                .rollNo(req.getRollNo())
                .year(req.getYear())
                .division(req.getDivision())
                .admissionYear(req.getAdmissionYear())
                .graduationYear(req.getGraduationYear())
                .skills(req.getSkills())
                .interests(req.getInterests())
                .college(linkedCollege)
                .branch(branch)
//                .emailVerified(false)
//                .phoneVerified(false)
//                .verificationCode(UUID.randomUUID().toString()) // optional: for email/phone verification
                .build();
    }

    public StudentResponse convertToStudentResponse(Student student) {
        if (student == null) {
            return null;
        }

        return StudentResponse.builder()
                .id(student.getId())
                .username(student.getUsername())
                .name(student.getName())
                .email(student.getEmail())
                .phone(student.getPhone())
                .rollNo(student.getRollNo())
                .branch(student.getBranch() != null ? student.getBranch().getName() : null)
                .year(student.getYear())
                .division(student.getDivision())
                .admissionYear(student.getAdmissionYear())
                .graduationYear(student.getGraduationYear())
                .collegeId(student.getCollege() != null ? student.getCollege().getId() : null)
                .collegeName(student.getCollege() != null ? student.getCollege().getName() : null)
                .collegeShortForm(student.getCollege() != null ? student.getCollege().getShortForm() : null)
                .identificationNumber(student.getIdentificationNumber())
                .skills(student.getSkills())
                .interests(student.getInterests())
                .emailVerified(student.isEmailVerified())
                .phoneVerified(student.isPhoneVerified())
                .createdAt(student.getCreatedAt())
                .updatedAt(student.getUpdatedAt())
                .build();
    }

    public StudentSummary convertToStudentSummary(Student student){
        if(student == null) return null;
        return StudentSummary.builder()
                .id(student.getId())
                .name(student.getName())
                .gender(student.getGender())
                .identificationNumber(student.getIdentificationNumber())
                .email(student.getEmail())
                .phone(student.getPhone())
                .rollNo(student.getRollNo())
                .year(student.getYear())
                .division(student.getDivision())
                .collegeId(student.getCollege().getId())
                .branch(student.getBranch().getShortForm())
                .build();
    }
}
