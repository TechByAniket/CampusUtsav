package com.example.CampusUtsav.serviceImpl;

import com.example.CampusUtsav.dtos.EventRegistrationRequest;
import com.example.CampusUtsav.dtos.EventRegistrationResponse;
import com.example.CampusUtsav.entity.Event;
import com.example.CampusUtsav.entity.EventMemberRegistration;
import com.example.CampusUtsav.entity.EventRegistration;
import com.example.CampusUtsav.entity.Student;
import com.example.CampusUtsav.mapper.EventMemberRegistrationMapper;
import com.example.CampusUtsav.mapper.EventRegistrationMapper;
import com.example.CampusUtsav.repository.EventMemberRegistrationRepository;
import com.example.CampusUtsav.repository.EventRegistrationRepository;
import com.example.CampusUtsav.repository.EventRepository;
import com.example.CampusUtsav.repository.StudentRepository;
import com.example.CampusUtsav.service.EventRegistrationService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class EventRegistrationServiceImpl implements EventRegistrationService {

    private final EventRepository eventRepository;
    private final StudentRepository studentRepository;
    private final EventRegistrationRepository eventRegistrationRepository;
    private final EventRegistrationMapper eventRegistrationMapper;
    private final EventMemberRegistrationRepository eventMemberRegistrationRepository;
    private final EventMemberRegistrationMapper eventMemberRegistrationMapper;



    @Override
    @Transactional
    public EventRegistrationResponse registerForEvent(Integer eventId, EventRegistrationRequest request) throws BadRequestException {
        Event linkedEvent = eventRepository.findById(eventId)
                .orElseThrow(()-> new EntityNotFoundException("Event Not Found!"));

        Student registeredStudent = studentRepository.findById(request.getStudentId())
                .orElseThrow(()-> new EntityNotFoundException("Student Not Found!"));

        // check: if student already registered for this event
        boolean isAlreadyRegistered = eventRegistrationRepository.existsByEventAndStudent(linkedEvent, registeredStudent);
        if(isAlreadyRegistered){
            throw new BadRequestException("You have already registered for the same event");
        }

        List<Student> allTeamMembers = studentRepository.findAllById(request.getTeamMemberIds());

        EventRegistration eventRegistration = eventRegistrationMapper.convertToEventRegistrationEntity(request, linkedEvent, registeredStudent, allTeamMembers);


        // If this is a team registration, generate invite code + optional expiry
        if("team".equalsIgnoreCase(request.getRegistrationType())){
            // generate a token
            String inviteCode = UUID.randomUUID().toString();

            // check if it exits, rare case. Change until it becomes unique
            while(eventRegistrationRepository.findByInviteCode(inviteCode).isPresent()){
                inviteCode = UUID.randomUUID().toString();
            }

            // === DONT FORGET , WE HAVE TO ADD INVITE URL, ONCE HOSTED === //

            // set inviteLinkExpiry
            LocalDateTime inviteLinkExpiresAt = LocalDateTime.now().plusDays(7);

            eventRegistration.setInviteCode(inviteCode);
            eventRegistration.setInviteExpiresAt(inviteLinkExpiresAt);
        }

        eventRegistration = eventRegistrationRepository.save(eventRegistration);


        //  Create the leader member record (leader is the student who created this registration)
        EventMemberRegistration leaderRegistered = eventMemberRegistrationMapper.convertToLeader(eventRegistration, registeredStudent);
        eventMemberRegistrationRepository.save(leaderRegistered);

        return eventRegistrationMapper.toLeaderResponse(eventRegistration);
    }

    @Override
    @Transactional
    public EventRegistrationResponse joinTeamByInviteLink(String inviteCode, Integer studentId) throws BadRequestException {
        // find registration by invite code, its just the registered event details of one team( made by the first person)
        EventRegistration linkedEventRegistration = eventRegistrationRepository.findByInviteCode(inviteCode)
                .orElseThrow(()-> new EntityNotFoundException("Invalid Invite Code or Invite Code doesn't exist"));

        // ensure this registration was created for a team
        if(!"team".equalsIgnoreCase(linkedEventRegistration.getRegistrationType())){
            throw new BadRequestException("The event is not a team event");
        }

        if(linkedEventRegistration.getInviteExpiresAt().isBefore(LocalDateTime.now())){
            throw new BadRequestException("Invite has expired!");
        }

        Student teamMember = studentRepository.findById(studentId)
                .orElseThrow(()-> new EntityNotFoundException("Student not found!"));

        // this will just check if the teamMember already in the team or not
        // it will just pass the eventRegistration details that was registered by first person of team (leader)
        boolean isAlreadyRegistered = eventMemberRegistrationRepository.existsByLinkedEventAndStudent(linkedEventRegistration, teamMember);

        // this will pass the event for which the team is registering,
        // so by getting that event, we can scan all the teams for that received event
        // and check if teamMember matches the same event or not in any other team
        boolean isInAnotherTeam = eventMemberRegistrationRepository.existsByStudentInOtherTeam(linkedEventRegistration.getEvent(),teamMember);

        // checking if the team is exceeding the team size
        Integer maxTeamSize = linkedEventRegistration.getEvent().getTeamSize();
        if(maxTeamSize != null){
            // _Id tells Spring Data JPA: “Look inside the related entity’s primary key field.”
            // It’s more efficient if you already have the ID, because no need to load the full related entity.
            int currentTeamSize = eventMemberRegistrationRepository.countByLinkedEvent_Id(linkedEventRegistration.getId());
            if(currentTeamSize >= maxTeamSize){
                throw new BadRequestException("Team is already full!");
            }
        }

        EventMemberRegistration member = eventMemberRegistrationMapper.convertToMember(linkedEventRegistration, teamMember);

        try{
            member = eventMemberRegistrationRepository.save(member);
        } catch(DataIntegrityViolationException exception){
            throw new BadRequestException("Error joining the team, Please try again!");
        }

         // your current linkedEventRegistration object (the one fetched earlier) may not yet have that updated member list in memory,
        // because JPA’s persistence context doesn’t automatically refresh collections after related inserts unless you re-query.
        EventRegistration updated = eventRegistrationRepository.findById(linkedEventRegistration.getId())
                .orElseThrow(()-> new EntityNotFoundException("Registration disappeared"));

        return eventRegistrationMapper.toMemberResponse(updated);
    }
}
