package fr.yha.portfolio.webservices.controller;

import fr.yha.portfolio.webservices.gateway.ResumeGateway;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
@RequestMapping("/resume")
public class ResumeController {

    private static final Logger LOGGER = LoggerFactory.getLogger(ResumeController.class);

    @Autowired
    private ResumeGateway resumeGateway;

    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadResume() {
        LOGGER.info("Starting resume creation and download process.");
        try {
            byte[] resumeBytes = resumeGateway.downloadResume();
            LOGGER.info("Resume downloaded successfully.");
            return ResponseEntity.ok()
                    .header("Content-Type", "application/pdf")
                    .header("Content-Disposition", "attachment; filename=CV-développeur-Java.pdf")
                    .body(resumeBytes);
        } catch (Exception e) {
            LOGGER.error("Error during resume download : {}", e.getMessage(), e);
            return null;
        }
    }
}

