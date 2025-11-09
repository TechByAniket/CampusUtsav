package com.example.CampusUtsav.serviceImpl;

import com.example.CampusUtsav.dtos.EventRequest;
import com.example.CampusUtsav.dtos.EventResponse;
import com.example.CampusUtsav.entity.Club;
import com.example.CampusUtsav.entity.College;
import com.example.CampusUtsav.entity.Event;
import com.example.CampusUtsav.entity.enums.EventStatus;
import com.example.CampusUtsav.entity.enums.EventType;
import com.example.CampusUtsav.mapper.EventMapper;
import com.example.CampusUtsav.repository.ClubRepository;
import com.example.CampusUtsav.repository.CollegeRepository;
import com.example.CampusUtsav.repository.EventRepository;
import com.example.CampusUtsav.service.EventService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.Arrays;
import java.util.List;

@Service
@AllArgsConstructor
public class EventServiceImpl implements EventService {

    private final ClubRepository clubRepository;
    private final CollegeRepository collegeRepository;
    private final EventRepository eventRepository;
    private final EventMapper eventMapper;

    @Override
    public List<String> getAllEventTypes() {
        return Arrays.stream(EventType.values())
                .map(Enum::name)
                .toList();
    }

    @Override
    public List<String> getAllEventStatuses() {
        return Arrays.stream(EventStatus.values())
                .map(Enum::name)
                .toList();
    }

    @Override
    @Transactional
    public EventResponse createEvent(EventRequest request) {
        Club linkedClub = clubRepository.findById(request.getClubId())
                .orElseThrow(()-> new EntityNotFoundException("Club Not Found"));

        College linkedCollege = linkedClub.getCollege();

        String normalizedTitle = request.getTitle().trim().toLowerCase().replaceAll("\\s+", "");

        boolean exists = eventRepository.existsByNormalizedTitleAndDateAndClubId(
                normalizedTitle, request.getDate(), linkedClub.getId());

        if (exists) {
            throw new IllegalArgumentException("Event with same title, date and club already exists");
        }
//        College linkedCollege = collegeRepository.findById(linkedClub.getCollege().getId())
//                .orElseThrow(()-> new EntityNotFoundException("College Not Found!"));

        Event newEvent = eventMapper.convertToEventEntity(request, linkedCollege, linkedClub);

        newEvent = eventRepository.save(newEvent);

        return eventMapper.convertToEventResponse(newEvent);
    }
}
