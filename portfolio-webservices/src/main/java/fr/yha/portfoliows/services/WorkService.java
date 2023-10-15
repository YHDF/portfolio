package fr.yha.portfoliows.services;

import fr.yha.portfoliocore.entity.Work;
import fr.yha.portfoliocore.repositories.WorkRepository;
import fr.yha.portfoliows.data.dto.WorkDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class WorkService {

    private static final Logger LOGGER = LoggerFactory.getLogger(WorkService.class);

    private final WorkRepository workRepository;

    public WorkService(WorkRepository workRepository){
        this.workRepository = workRepository;
    }

    public List<WorkDTO> getWorkExperiences(){
        LOGGER.info("Fetching work experiences...");

        List<WorkDTO> workDTOS = new ArrayList<>();
        List<Work> works;
        try {
            works = this.workRepository.findAll();
        } catch (Exception e) {
            LOGGER.error("Error fetching work experiences from repository: {}", e.getMessage(), e);
            throw e;
        }

        if (works.isEmpty()) {
            LOGGER.warn("No work experiences found in the repository");
            return Collections.emptyList();
        }

        LOGGER.info("Found {} work experiences, converting to WorkDTOs...", works.size());

        works.forEach(work -> {
            WorkDTO workDTO = new WorkDTO();
            workDTO.setTitle(work.getTitle());
            workDTO.setPeriod(work.getPeriod());
            workDTO.setDescription(work.getDescription());
            workDTO.setTasks(List.of(work.getTasks().split(";")));
            workDTOS.add(workDTO);
            LOGGER.debug("Converted Work to WorkDTO: {}", workDTO);
        });

        LOGGER.info("Successfully fetched and converted {} work experiences", workDTOS.size());
        return workDTOS;
    }
}
