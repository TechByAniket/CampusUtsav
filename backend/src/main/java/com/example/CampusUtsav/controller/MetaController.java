package com.example.CampusUtsav.controller;

import com.example.CampusUtsav.entity.enums.Designation;
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

    @GetMapping("/staff-designations")
    public ResponseEntity<Map<String, List<Map<String, String>>>> getStaffDesignationsMeta() {
        Designation[] designationsArray = Designation.values();
        List<Map<String, String>> designations = Arrays.stream(designationsArray)
                .limit(3)
                .map(d -> Map.of(
                        "code", d.name(),
                        "label", d.getLabel()
                ))
                .toList();

        return ResponseEntity.ok(
                Map.of("designations", designations)
        );
    }

    @GetMapping("/branches")
    public List<Map<String, Object>> getBranches() {
        return List.of(
                Map.of("id", 1, "name", "Computer Engineering", "shortForm", "COMP"),
                Map.of("id", 2, "name", "Information Technology", "shortForm", "IT"),
                Map.of("id", 3, "name", "Electronics and Computer Science", "shortForm", "ECS"),
                Map.of("id", 4, "name", "Electronics and Telecommunication Engineering", "shortForm", "ELEC"),
                Map.of("id", 5, "name", "Mechanical Engineering", "shortForm", "MECH"),
                Map.of("id", 6, "name", "Automobile Engineering", "shortForm", "AUTO"),
                Map.of("id", 7, "name", "Robotics and Artificial Intelligence", "shortForm", "ROBO"),
                Map.of("id", 8, "name", "Artificial Intelligence and Data Science", "shortForm", "AIDS"),
                Map.of("id", 9, "name", "Electronics and Telecommunication", "shortForm", "EXTC")
        );
    }
}