package com.example.CampusUtsav.mapper;

import com.example.CampusUtsav.dtos.EventRegistrationRequest;
import com.example.CampusUtsav.dtos.EventRegistrationResponse;
import com.example.CampusUtsav.dtos.miniDtos.EventSummary;
import com.example.CampusUtsav.dtos.miniDtos.StudentSummary;
import com.example.CampusUtsav.entity.Event;
import com.example.CampusUtsav.entity.EventMemberRegistration;
import com.example.CampusUtsav.entity.EventRegistration;
import com.example.CampusUtsav.entity.Student;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@AllArgsConstructor
public class EventRegistrationMapper {

    private final StudentMapper studentMapper;
    private final EventMapper eventMapper;

    public EventRegistration convertToEventRegistrationEntity(EventRegistrationRequest req,
                                                              Event linkedEvent,
                                                              Student registeredStudent,
                                                              List<Student> allTeamMembers){
         EventRegistration registration = EventRegistration.builder()
                .event(linkedEvent)

                .student(registeredStudent)
                .registrationType(req.getRegistrationType())
                .teamName(req.getTeamName())
                .extraInfo(req.getExtraInfo())
                .build();

        // for each member record in EventMemberRegistration entity:
        List<EventMemberRegistration> members = allTeamMembers.stream()
                .map(curMember->EventMemberRegistration.builder()
                        .linkedEvent(registration)
                        .event(registration.getEvent())
                        .student(curMember)
                        .build())
                .toList();

        registration.setTeamMembers(members);

        return registration;

    }

//    public EventRegistrationResponse convertToEventRegistrationResponse(EventRegistration eventRegistration){
//        return EventRegistrationResponse.builder()
//                .event(EventSummary.builder()
//                        .id(eventRegistration.getEvent().getId())
//                        .title(eventRegistration.getEvent().getTitle())
//                        .date(eventRegistration.getEvent().getDate())
//                        .clubId(eventRegistration.getEvent().getClub().getId())
//                        .clubName(eventRegistration.getEvent().getClub().getName())
//                        .build())
//                .student(StudentSummary.builder()
//                        .id(eventRegistration.getStudent().getId())
//                        .name(eventRegistration.getStudent().getName())
//                        .gender(eventRegistration.getStudent().getGender())
//                        .identificationNumber(eventRegistration.getStudent().getIdentificationNumber())
//                        .email(eventRegistration.getStudent().getEmail())
//                        .rollNo(eventRegistration.getStudent().getRollNo())
//                        .year(eventRegistration.getStudent().getYear())
//                        .division(eventRegistration.getStudent().getDivision())
//                        .branch(eventRegistration.getStudent().getBranch().getShortForm())
//                        .build())
//                .build();
//    }

    public EventRegistrationResponse toLeaderResponse(EventRegistration reg){
        return EventRegistrationResponse.builder()
                .id(reg.getId())
                .teamName(reg.getTeamName())
                .registrationType(reg.getRegistrationType())
                .inviteCode(reg.getInviteCode())
                .inviteUrl(reg.getInviteUrl())
                .registeredAt(reg.getRegisteredAt())
                .event(eventMapper.convertToEventSummary(reg.getEvent()))
                .student(studentMapper.convertToStudentSummary(reg.getStudent()))
                .teamMembers(
                        reg.getTeamMembers().stream()
                                .map(curMember -> studentMapper.convertToStudentSummary(curMember.getStudent()))
                                .collect(Collectors.toList())
                )
                .build();


    }

    public EventRegistrationResponse toMemberResponse(EventRegistration reg) {
        return EventRegistrationResponse.builder()
                .id(reg.getId())
                .teamName(reg.getTeamName())
                .registrationType(reg.getRegistrationType())
                .event(eventMapper.convertToEventSummary(reg.getEvent()))
                .student(studentMapper.convertToStudentSummary(reg.getStudent())) // leader info
                .teamMembers(reg.getTeamMembers().stream()
                        .map(curMember -> studentMapper.convertToStudentSummary(curMember.getStudent()))
                        .collect(Collectors.toList()))
                .build();
    }

    public EventRegistrationResponse toListIndividualParticipantsResponse(EventRegistration entry){
        return EventRegistrationResponse.builder()
                .id(entry.getId())
                .student(studentMapper.convertToStudentSummary(entry.getStudent()))
                .event(eventMapper.convertToEventSummary(entry.getEvent()))
                .build();
    }

    public EventRegistrationResponse toListTeamParticipantsResponse(EventRegistration entry){
        return EventRegistrationResponse.builder()
                .id(entry.getId())
                .teamName(entry.getTeamName())
                .student(studentMapper.convertToStudentSummary(entry.getStudent()))
                .teamMembers(entry.getTeamMembers() == null ? List.of() :
                        entry.getTeamMembers().stream()
                                .map(curMember -> studentMapper.convertToStudentSummary(curMember.getStudent()))
                                .collect(Collectors.toList()))
                .event(eventMapper.convertToEventSummary(entry.getEvent()))
                .build();
    }
}
