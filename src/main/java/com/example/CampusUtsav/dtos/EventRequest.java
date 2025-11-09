package com.example.CampusUtsav.dtos;

import com.example.CampusUtsav.entity.enums.EventStatus;
import com.example.CampusUtsav.entity.enums.EventType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EventRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Event type is required")
    private EventType eventType;

    @NotBlank(message = "Description is required")
    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    private String description;

    private int fees;

    private String posterUrl; // optional

    @NotBlank(message = "Venue is required")
    private String venue;

    @NotNull(message = "Event date is required")
    private LocalDate date;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;

//    @Min(value = 1, message = "Max participants must be at least 1")
    private int maxParticipants;

    private List<String> attachments;

    private List<@NotBlank(message = "Tag cannot be blank") String> tags;

    private EventStatus status; // optional, backend can default to PENDING

    @Pattern(regexp = "^(https?://.+)?$", message = "Registration link must be a valid URL")
    private String registrationLink;

    private Map<@NotBlank(message = "Contact name cannot be blank") String,
                @Pattern(regexp = "\\d{10}", message = "Contact number must be 10 digits") String> contactDetails;

    private String extraInfo; // optional, JSON as string

    @NotNull(message = "Club ID is required")
    private Integer clubId; // just the club id from frontend
}

