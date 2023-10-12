package fr.yha.portfolio.webservices.controller;


import fr.yha.portfolio.data.dto.WorkDTO;
import fr.yha.portfolio.webservices.gateway.WorkGateway;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "/work")
public class WorkController {

    private static final Logger LOGGER = LoggerFactory.getLogger(WorkController.class);

    private final WorkGateway workGateway;

    public WorkController(WorkGateway workGateway){
        this.workGateway = workGateway;
    }

    @GetMapping("/experiences")
    public List<WorkDTO> getWorkExperiences() {
        LOGGER.info("Received request to get work experiences.");

        try {
            List<WorkDTO> workExperiences = this.workGateway.getWorkExperiences();
            LOGGER.info("Successfully retrieved {} work experiences.", workExperiences.size());
            return workExperiences;
        } catch (Exception e) {
            LOGGER.error("Error retrieving work experiences: {}", e.getMessage(), e);
            throw e; // consider handling the exception and sending a user-friendly error message
        }
    }
}
