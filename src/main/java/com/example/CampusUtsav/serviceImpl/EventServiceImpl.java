package com.example.CampusUtsav.serviceImpl;

import com.example.CampusUtsav.dtos.EventRequest;
import com.example.CampusUtsav.dtos.EventResponse;
import com.example.CampusUtsav.dtos.miniDtos.EventSummary;
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
import com.example.CampusUtsav.service.SupabaseService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class EventServiceImpl implements EventService {

    private final ClubRepository clubRepository;
    private final CollegeRepository collegeRepository;
    private final EventRepository eventRepository;
    private final EventMapper eventMapper;
    private final SupabaseService supabaseService;

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
    public EventResponse createEvent(EventRequest request, MultipartFile file, Integer clubId) {
        Club linkedClub = clubRepository.findById(clubId)
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

        String posterUrl = supabaseService.uploadFile(file);
        if(posterUrl.isEmpty()){
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to upload event poster"
            );
        }
        Event newEvent = eventMapper.convertToEventEntity(request, linkedCollege, linkedClub);

        newEvent = eventRepository.save(newEvent);
        newEvent.setPosterUrl(posterUrl);

        return eventMapper.convertToEventResponse(newEvent);
    }

    @Override
    public List<EventSummary> getAllEventsByCollege(String collegeId){
        return null;
    }

    @Override
    public List<EventSummary> getAllEventsByClub(Integer clubId) {

        List<Event> eventsByClub = eventRepository.findByClub_Id(clubId);

        return eventsByClub.stream()
                .map(eventMapper::convertToEventSummary) // or EventMapper.toSummary(event)
                .toList(); // Java 16+
    }
}
