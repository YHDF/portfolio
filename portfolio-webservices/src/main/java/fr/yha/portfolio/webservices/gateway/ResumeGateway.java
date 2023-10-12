package fr.yha.portfolio.webservices.gateway;

import fr.yha.portfolio.services.ResumeService;
import fr.yha.portfoliocore.component.ResumeProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class ResumeGateway {
    private static final Logger LOGGER = LoggerFactory.getLogger(ResumeGateway.class);

    private final ResumeProperties resumeProperties;

    private final ResumeService resumeService;

    public ResumeGateway(ResumeProperties resumeProperties, ResumeService resumeService) {
        this.resumeProperties = resumeProperties;
        this.resumeService = resumeService;
    }

    public byte[] downloadResume() throws Exception {
        String filePath = resumeProperties.getResumeFilePath() + resumeProperties.getResumeFileName();
        Path path = Paths.get(filePath);
        if (!Files.exists(path)) {
            LOGGER.info("Resume file not found at {}. Initiating resume generation job...", filePath);

            try {
                resumeService.launchResumeGenerationJob();
                LOGGER.info("Resume generation job launched successfully.");
                // TODO: You may need to wait for the job to complete, handle this part accordingly
            } catch (Exception e) {
                LOGGER.error("Error initiating resume generation job: {}", e.getMessage(), e);
                throw e; // propagate the exception
            }
            // TODO: You may need to wait for the job to complete, handle this part accordingly
            // Then read and return the newly created file
        }
        else {
            LOGGER.info("Resume file found at {}. Proceeding with file download.", filePath);
        }
        // Read and return the file
        try {
            return Files.readAllBytes(path);
        } catch (Exception e) {
            LOGGER.error("Error reading resume file from {}: {}", filePath, e.getMessage(), e);
            throw e; // propagate the exception
        }
    }
}

