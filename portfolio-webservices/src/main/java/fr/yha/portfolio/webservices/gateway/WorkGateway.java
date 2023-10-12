package fr.yha.portfolio.webservices.gateway;

import fr.yha.portfolio.data.dto.WorkDTO;
import fr.yha.portfolio.services.WorkService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkGateway {

    private static final Logger LOGGER = LoggerFactory.getLogger(WorkGateway.class);

    private final WorkService workService;

    public WorkGateway(WorkService workService){
        this.workService = workService;
    }

    public List<WorkDTO> getWorkExperiences(){
        LOGGER.info("Fetching work experiences through gateway...");

        try {
            List<WorkDTO> workExperiences = this.workService.getWorkExperiences();
            LOGGER.info("Successfully retrieved {} work experiences through gateway.", workExperiences.size());
            return workExperiences;
        } catch (Exception e) {
            LOGGER.error("Error fetching work experiences through gateway: {}", e.getMessage(), e);
            throw e; // Consider handling the exception and returning a user-friendly error message or response
        }
    }
}

