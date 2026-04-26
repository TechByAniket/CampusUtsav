package com.example.CampusUtsav.serviceImpl;

import com.example.CampusUtsav.dtos.EventParticipantsResponse;
import com.example.CampusUtsav.dtos.EventRegistrationRequest;
import com.example.CampusUtsav.dtos.EventRegistrationResponse;
import com.example.CampusUtsav.dtos.miniDtos.StudentSummary;
import com.example.CampusUtsav.dtos.miniDtos.TeamParticipant;
import com.example.CampusUtsav.entity.*;
import com.example.CampusUtsav.entity.enums.Role;
import com.example.CampusUtsav.mapper.EventRegistrationMapper;
import com.example.CampusUtsav.mapper.StudentMapper;
import com.example.CampusUtsav.mapper.TeamMapper;
import com.example.CampusUtsav.mapper.TeamMemberMapper;
import com.example.CampusUtsav.repository.*;
import com.example.CampusUtsav.security.model.CustomUserDetails;
import com.example.CampusUtsav.service.EventRegistrationService;
import jakarta.persistence.EntityNotFoundException;
//import jakarta.transaction.Transactional;
import org.springframework.transaction.annotation.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.*;

@Service
@AllArgsConstructor
public class EventRegistrationServiceImpl implements EventRegistrationService {

    private final EventRepository eventRepository;
    private final StudentRepository studentRepository;
    private final EventRegistrationRepository eventRegistrationRepository;
    private final EventRegistrationMapper eventRegistrationMapper;
    private final CollegeRepository collegeRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberMapper teamMemberMapper;
    private final TeamMapper teamMapper;
    private final StudentMapper studentMapper;
    private final StaffRepository staffRepository;

    @Override
    @Transactional
    public EventRegistrationResponse registerForEvent(
            Integer eventId,
            EventRegistrationRequest request,
            CustomUserDetails currentUser
    ) {

        // =========================
        // Validate Event
        // =========================
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        if (!Objects.equals(event.getClub().getCollege().getId(), currentUser.getCollegeId())) {
            throw new RuntimeException("Not allowed for other college events");
        }

        String type = request.getRegistrationType().toUpperCase();

        // ==================================================
        // INDIVIDUAL REGISTRATION
        // ==================================================
        if ("INDIVIDUAL".equals(type)) {

            Student student = studentRepository.findById(request.getStudentId())
                    .orElseThrow(() -> new EntityNotFoundException("Student not found"));

            if (eventRegistrationRepository.existsByEvent_IdAndStudent_Id(eventId, student.getId())) {
                throw new RuntimeException("Student already registered for this event");
            }

            if (teamMemberRepository.existsByEvent_IdAndStudent_Id(eventId, student.getId())) {
                throw new RuntimeException("Student already part of a team for this event");
            }

            EventRegistration registration = eventRegistrationMapper.toEntity(
                    event,
                    student,
                    null
            );

            registration = eventRegistrationRepository.save(registration);

            return eventRegistrationMapper.toIndividualResponse(registration);
        }

        // ==================================================
        // TEAM REGISTRATION
        // ==================================================
        if ("TEAM".equals(type)) {

            // leader
            Student leader = studentRepository.findById(request.getLeaderId())
                    .orElseThrow(() -> new EntityNotFoundException("Leader not found"));

            // members (NULL SAFE + DISTINCT FIX)
            List<Student> members = Optional.ofNullable(request.getTeamMemberIds())
                    .orElseThrow(() -> new RuntimeException("Team members required"))
                    .stream()
                    .distinct()
                    .map(id -> studentRepository.findById(id)
                            .orElseThrow(() -> new EntityNotFoundException("Student not found: " + id)))
                    .toList();

            // ensure leader included
            if (members.stream().noneMatch(m -> m.getId().equals(leader.getId()))) {
                List<Student> updated = new ArrayList<>(members);
                updated.add(leader);
                members = updated;
            }

            // validate conflicts
            for (Student s : members) {

                if (eventRegistrationRepository.existsByEvent_IdAndStudent_Id(eventId, s.getId())) {
                    throw new RuntimeException("Already individually registered: " + s.getId());
                }

                if (teamMemberRepository.existsByEvent_IdAndStudent_Id(eventId, s.getId())) {
                    throw new RuntimeException("Already in another team: " + s.getId());
                }
            }

            // create team
            Team team = teamMapper.toEntity(request.getTeamName(), event, leader);
            team = teamRepository.save(team);

            // create team members
            Team finalTeam = team;
            List<TeamMember> teamMembers = members.stream()
                    .map(s -> teamMemberMapper.toEntity(finalTeam, s, event))
                    .toList();

            teamMemberRepository.saveAll(teamMembers);
            team.setMembers(teamMembers);

            // create registration
            EventRegistration registration = eventRegistrationMapper.toEntity(
                    event,
                    null,
                    team
            );

            registration = eventRegistrationRepository.save(registration);

            return eventRegistrationMapper.toTeamResponse(registration);
        }

        throw new RuntimeException("Invalid registration type");
    }



//    @Override
//    @Transactional
//    public EventRegistrationResponse joinTeamByInviteLink(String inviteCode, Integer studentId) throws BadRequestException {
//        // find registration by invite code, its just the registered event details of one team( made by the first person)
//        EventRegistration linkedEventRegistration = eventRegistrationRepository.findByInviteCode(inviteCode)
//                .orElseThrow(()-> new EntityNotFoundException("Invalid Invite Code or Invite Code doesn't exist"));
//
//        Integer eventId = linkedEventRegistration.getEvent().getId();
//        // ensure this registration was created for a team
//        if(!"team".equalsIgnoreCase(linkedEventRegistration.getRegistrationType())){
//            throw new BadRequestException("The event is not a team event");
//        }
//// ====================CHECK IF EVENT ALLOWS CROSS BRANCH TEAM OR BRANCH SPECIFIC TEAMS ==============================
//        if(linkedEventRegistration.getInviteExpiresAt().isBefore(LocalDateTime.now())){
//            throw new BadRequestException("Invite has expired!");
//        }
//
//        Student teamMember = studentRepository.findById(studentId)
//                .orElseThrow(()-> new EntityNotFoundException("Student not found!"));
//
//        // this will just check if the teamMember already in the team or not
//        // it will just pass the eventRegistration details that was registered by first person of team (leader)
////        boolean isAlreadyRegistered = eventMemberRegistrationRepository.existsByLinkedEventAndStudent(linkedEventRegistration, teamMember);
//
//        // this will pass the event for which the team is registering,
//        // so by getting that event, we can scan all the teams for that received event
//        // and check if teamMember matches the same event or not in any other team
////        boolean isInAnotherTeam = eventMemberRegistrationRepository.existsByStudentInOtherTeam(linkedEventRegistration.getEvent(),teamMember);
//
//        // 1. check: student already member of THIS team
//        if (eventMemberRegistrationRepository.existsByLinkedEventAndStudent(linkedEventRegistration, teamMember)) {
//            throw new BadRequestException("Student already in this team");
//        }
//
//        // 2. check: student is member in another team for same event
//        if (eventMemberRegistrationRepository.existsByStudent_IdAndLinkedEvent_Event_Id(studentId, eventId)) {
//            throw new BadRequestException("Student already part of another team for this event");
//        }
//
//        // 3. check: student is already registered (event_registration) for this event
//        if (eventRegistrationRepository.existsByEvent_IdAndStudent_Id(eventId, studentId)) {
//            throw new BadRequestException("Student already registered for this event");
//        }
//
//        // checking if the team is exceeding the team size
//        Integer maxTeamSize = linkedEventRegistration.getEvent().getTeamSize();
//        if(maxTeamSize != null){
//            // _Id tells Spring Data JPA: “Look inside the related entity’s primary key field.”
//            // It’s more efficient if you already have the ID, because no need to load the full related entity.
//            int currentTeamSize = eventMemberRegistrationRepository.countByLinkedEvent_Id(linkedEventRegistration.getId());
//            if(currentTeamSize >= maxTeamSize){
//                throw new BadRequestException("Team is already full!");
//            }
//        }
//
//        EventMemberRegistration member = eventMemberRegistrationMapper.convertToMember(linkedEventRegistration, teamMember);
//
//        try{
//            member = eventMemberRegistrationRepository.save(member);
//        } catch(DataIntegrityViolationException exception){
//            throw new BadRequestException("Error joining the team, Please try again!");
//        }
//
//         // your current linkedEventRegistration object (the one fetched earlier) may not yet have that updated member list in memory,
//        // because JPA’s persistence context doesn’t automatically refresh collections after related inserts unless you re-query.
//        EventRegistration updated = eventRegistrationRepository.findById(linkedEventRegistration.getId())
//                .orElseThrow(()-> new EntityNotFoundException("Registration disappeared"));
//
//        return eventRegistrationMapper.toMemberResponse(updated);
//    }

//    @Override
//    public List<EventRegistrationResponse> getAllRegistrationsOfEvent(Integer collegeId, Integer eventId) throws BadRequestException {
//
//        Event linkedEvent = eventRepository.findById(eventId)
//                .orElseThrow(()-> new EntityNotFoundException("Event not Found!"));
//
//        if (linkedEvent.getClub() == null || linkedEvent.getClub().getCollege() == null) {
//            throw new BadRequestException("Event does not have a valid club/college association.");
//        }
//
//        if(!Objects.equals(linkedEvent.getClub().getCollege().getId(),collegeId)){
//            throw new BadRequestException("The Event does not belongs to specified college!");
//        }
//
//        //Go into the event field of the current entity (EventRegistration),
//        //then look inside that Event entity for its id field,
//        //and filter by that.
//        List<EventRegistration> allRegistrationsOfEvent = eventRegistrationRepository.findAllByEvent_Id(eventId);
//
//        if (linkedEvent.isTeamEvent()){
//
//            return allRegistrationsOfEvent.stream()
//                    .map(eventRegistrationMapper :: toListTeamParticipantsResponse)
//                    .collect(Collectors.toList());
//        }
//
//        return allRegistrationsOfEvent.stream()
//                .map(eventRegistrationMapper :: toListIndividualParticipantsResponse)
//                .collect(Collectors.toList());
//    }
}
