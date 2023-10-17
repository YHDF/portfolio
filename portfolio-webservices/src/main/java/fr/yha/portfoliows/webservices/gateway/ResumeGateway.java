package fr.yha.portfoliows.webservices.gateway;

import fr.yha.portfoliocore.component.ResumeProperties;
import fr.yha.portfoliocore.entity.Resume;
import fr.yha.portfoliocore.services.BatchJobEventListenerImpl;
import fr.yha.portfoliows.services.ResumeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.concurrent.CompletableFuture;

@Service
public class ResumeGateway {
    private static final Logger LOGGER = LoggerFactory.getLogger(ResumeGateway.class);

    private final ResumeProperties resumeProperties;

    private final ResumeService resumeService;

    private final BatchJobEventListenerImpl<Resume, String> batchJobEventListenerImpl;

    public ResumeGateway(ResumeProperties resumeProperties, ResumeService resumeService, BatchJobEventListenerImpl<Resume, String> batchJobEventListenerImpl) {
        this.resumeProperties = resumeProperties;
        this.resumeService = resumeService;
        this.batchJobEventListenerImpl = batchJobEventListenerImpl;
    }


    public Flux<String> getServerSentEvents() {
        return this.batchJobEventListenerImpl.getFlux();
    }


    public byte[] downloadResume() throws IOException {
        String filePath = resumeProperties.getResumeFilePath() + resumeProperties.getResumeFileName();
        Path path = Paths.get(filePath);
        LOGGER.info("Initiating resume generation job...");
        CompletableFuture<Void> future = this.resumeService.launchResumeGenerationJob();
        future.join();
        LOGGER.info("Resume generation job launched successfully.");

        try {
            return Files.readAllBytes(path);
        } catch (Exception e) {
            LOGGER.error("Error reading resume file from {}: {}", filePath, e.getMessage(), e);
            throw new IOException("Error reading resume file", e);
        }
    }


}

