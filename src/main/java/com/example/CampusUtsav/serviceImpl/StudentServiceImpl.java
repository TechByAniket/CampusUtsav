package com.example.CampusUtsav.serviceImpl;

import com.example.CampusUtsav.dtos.StudentRegistrationRequest;
import com.example.CampusUtsav.dtos.StudentResponse;
import com.example.CampusUtsav.entity.Branch;
import com.example.CampusUtsav.entity.College;
import com.example.CampusUtsav.entity.Student;
import com.example.CampusUtsav.mapper.StudentMapper;
import com.example.CampusUtsav.repository.BranchRepository;
import com.example.CampusUtsav.repository.CollegeRepository;
import com.example.CampusUtsav.repository.StudentRepository;
import com.example.CampusUtsav.service.StudentService;
import com.example.CampusUtsav.utils.StudentUtils;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final CollegeRepository collegeRepository;
    private final StudentRepository studentRepository;
    private final StudentMapper studentMapper;
    private final BranchRepository branchRepository;
    private final StudentUtils studentUtils;


    @Override
    public StudentResponse registerStudent(StudentRegistrationRequest request) {

        if (request.getGraduationYear() <= request.getAdmissionYear()) {
            throw new IllegalArgumentException("Graduation year must be after admission year");
        }

        College linkedCollege = collegeRepository.findById(request.getCollegeId())
                .orElseThrow(()-> new EntityNotFoundException("College Not Found!"));

        Branch linkedBranch = branchRepository.findById(request.getBranchId())
                .orElseThrow(()-> new EntityNotFoundException("Branch Not Found!"));

        Student newStudent = studentMapper.convertToStudentEntity(request, linkedCollege, linkedBranch);
        newStudent.setUsername(studentUtils.generateStudentUsername(request, linkedCollege, linkedBranch));

        newStudent = studentRepository.save(newStudent);

        return studentMapper.convertToStudentResponse(newStudent);
    }
}
