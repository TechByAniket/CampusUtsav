package com.example.CampusUtsav.mapper;

import com.example.CampusUtsav.entity.Branch;
import com.example.CampusUtsav.utils.BranchUtils;
import com.example.CampusUtsav.utils.CollegeUtils;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class BranchMapper {

    private final BranchUtils branchUtils;

    public Branch convertToBranchEntity(String branchName){
        return Branch.builder()
                .name(branchName)
                .shortForm(branchUtils.generateShortForm(branchName))
                .build();
    }
}
