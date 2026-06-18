package com.example.CampusUtsav.mapper;

import com.example.CampusUtsav.dtos.EventTrendResponse;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@AllArgsConstructor
public class AnalyticsMapper {

    public List<EventTrendResponse> buildEmptyTrendResponse() {

        List<String> months = List.of(
                "JAN", "FEB", "MAR", "APR",
                "MAY", "JUN", "JUL", "AUG",
                "SEP", "OCT", "NOV", "DEC"
        );

        List<EventTrendResponse> response =
                new ArrayList<>();

        for (String month : months) {

            response.add(
                    EventTrendResponse.builder()
                            .month(month)
                            .count(0)
                            .build()
            );
        }

        return response;
    }
}
