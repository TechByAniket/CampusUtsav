package com.example.CampusUtsav.mapper;

import com.example.CampusUtsav.dtos.EventRegistrationRequest;
import com.example.CampusUtsav.dtos.EventRegistrationResponse;
import com.example.CampusUtsav.dtos.miniDtos.EventSummary;
import com.example.CampusUtsav.dtos.miniDtos.StudentSummary;
import com.example.CampusUtsav.entity.Event;
import com.example.CampusUtsav.entity.EventMemberRegistration;
import com.example.CampusUtsav.entity.EventRegistration;
import com.example.CampusUtsav.entity.Student;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class EventRegistrationMapper {

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
                .event(EventSummary.from(reg.getEvent()))
                .student(StudentSummary.from(reg.getStudent()))
                .teamMembers(reg.getTeamMembers().stream()
                        .map(curMember -> StudentSummary.from(curMember.getStudent()))
                        .collect(Collectors.toList()))
                .build();

    }

    public EventRegistrationResponse toMemberResponse(EventRegistration reg) {
        return EventRegistrationResponse.builder()
                .id(reg.getId())
                .teamName(reg.getTeamName())
                .registrationType(reg.getRegistrationType())
                .event(EventSummary.from(reg.getEvent()))
                .student(StudentSummary.from(reg.getStudent())) // leader info
                .teamMembers(reg.getTeamMembers().stream()
                        .map(curMember -> StudentSummary.from(curMember.getStudent()))
                        .collect(Collectors.toList()))
                .build();
    }

    public EventRegistrationResponse toListIndividualParticipantsResponse(EventRegistration entry){
        return EventRegistrationResponse.builder()
                .id(entry.getId())
                .student(StudentSummary.from(entry.getStudent()))
                .event(EventSummary.from(entry.getEvent()))
                .build();
    }

    public EventRegistrationResponse toListTeamParticipantsResponse(EventRegistration entry){
        return EventRegistrationResponse.builder()
                .id(entry.getId())
                .teamName(entry.getTeamName())
                .student(StudentSummary.from(entry.getStudent()))
                .teamMembers(entry.getTeamMembers() == null ? List.of() :
                        entry.getTeamMembers().stream()
                                .map(curMember -> StudentSummary.from(curMember.getStudent()))
                                .collect(Collectors.toList()))
                .event(EventSummary.from(entry.getEvent()))
                .build();
    }
}
