package fr.yha.portfoliows.webservices.controller;

import fr.yha.portfoliows.webservices.gateway.ResumeGateway;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import reactor.core.publisher.Flux;

import java.sql.Timestamp;
import java.util.Date;


@Controller
@RequestMapping("/resume")
public class ResumeController {

    private static final Logger LOGGER = LoggerFactory.getLogger(ResumeController.class);

    @Autowired
    private ResumeGateway resumeGateway;

    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadResume(@RequestParam String version) {
        LOGGER.info("Starting resume creation and download process.");
        try {
            byte[] resumeBytes = resumeGateway.downloadResume(version);
            LOGGER.info("Resume downloaded successfully.");
            Date date = new Date();
            Timestamp ts = new Timestamp(date.getTime());
            return ResponseEntity.ok()
                    .header("Content-Type", "application/pdf")
                    .header("Content-Disposition", "attachment; filename=CV-développeur-Java-" + ts.getTime() + ".pdf")
                    .body(resumeBytes);
        } catch (Exception e) {
            LOGGER.error("Error during resume download : {}", e.getMessage(), e);
            return null;
        }
    }

    @GetMapping(path = "/stream-sse", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> getServerSentEvents() {
        return resumeGateway.getServerSentEvents();
    }
}

