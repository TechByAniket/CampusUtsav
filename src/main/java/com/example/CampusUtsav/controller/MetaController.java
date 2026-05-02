package com.example.CampusUtsav.controller;

import com.example.CampusUtsav.entity.enums.RegistrationStatus;
import com.example.CampusUtsav.entity.enums.TeamMemberStatus;
import com.example.CampusUtsav.entity.enums.TeamStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@RestController
@RequestMapping("/api/public/meta")
public class MetaController {

    @GetMapping("/registrations")
    public ResponseEntity<Map<String, List<Map<String, String>>>> getRegistrationMeta() {

        List<Map<String, String>> statuses =
                Arrays.stream(RegistrationStatus.values())
                        .map(e -> Map.of(
                                "code", e.name(),
                                "label", e.getLabel()
                        ))
                        .toList();

        return ResponseEntity.ok(
                Map.of("registrationStatus", statuses)
        );
    }

    @GetMapping("/teams")
    public ResponseEntity<Map<String, List<Map<String, String>>>> getTeamMeta() {

        List<Map<String, String>> teamStatuses =
                Arrays.stream(TeamStatus.values())
                        .map(e -> Map.of(
                                "code", e.name(),
                                "label", e.getLabel()
                        ))
                        .toList();

        List<Map<String, String>> memberStatuses =
                Arrays.stream(TeamMemberStatus.values())
                        .map(e -> Map.of(
                                "code", e.name(),
                                "label", e.name().replace("_", " ")
                        ))
                        .toList();

        return ResponseEntity.ok(
                Map.of(
                        "teamStatus", teamStatuses,
                        "teamMemberStatus", memberStatuses
                )
        );
    }
}