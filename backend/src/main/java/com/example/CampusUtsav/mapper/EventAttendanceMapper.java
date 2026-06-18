package com.example.CampusUtsav.mapper;

import com.example.CampusUtsav.dtos.EventAttendanceResponse;
import com.example.CampusUtsav.dtos.miniDtos.StudentAttendance;
import com.example.CampusUtsav.entity.Event;
import com.example.CampusUtsav.entity.EventAttendance;
import com.example.CampusUtsav.entity.Student;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@AllArgsConstructor
public class EventAttendanceMapper {

    public EventAttendance toEventAttendanceEntity (Event event,
                                                    Student student,
                                                    boolean isPresent,
                                                    LocalDateTime now
    ) {
        return EventAttendance.builder()
                .event(event)
                .student(student)
                .present(isPresent)
                .markedAt(now)
                .build();
    }

    public EventAttendanceResponse toEventAttendanceResponse(Integer eventId,
                                                             List<Student> uniqueParticipants,
                                                             List<EventAttendance> attendanceRecords,
                                                             List<StudentAttendance> attendees
                                                             ){
        return EventAttendanceResponse.builder()
                .eventId(eventId)
                .totalParticipants(uniqueParticipants.size())
                .totalPresent(attendanceRecords.size())
                .attendees(attendees)
                .build();
    }

    public StudentAttendance toStudentAttendance(Student student, EventAttendance attendance){
        return StudentAttendance.builder()
                .studentId(student.getId())
                .name(student.getName())
                .div(student.getDivision())
                .year(student.getYear())
                .identificationNumber(student.getIdentificationNumber())
                .branch(student.getBranch().getShortForm())
                .rollNo(student.getRollNo())
                .present(attendance != null)
                .markedAt(attendance != null ? attendance.getMarkedAt() : null)
                .build();
    }
}
