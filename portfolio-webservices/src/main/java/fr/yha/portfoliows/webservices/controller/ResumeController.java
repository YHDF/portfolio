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
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import reactor.core.publisher.Flux;


@Controller
@RequestMapping("/resume")
public class ResumeController {

    private static final Logger LOGGER = LoggerFactory.getLogger(ResumeController.class);

    @Autowired
    private ResumeGateway resumeGateway;

    private final SseEmitter emitter = new SseEmitter(Long.MAX_VALUE); // Keep the connection open indefinitely

    @GetMapping("/sse")
    public SseEmitter handleSse() {
        return emitter;
    }

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

    @GetMapping(path = "/stream-see", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> getServerSentEvents() {
        return resumeGateway.getServerSentEvents();
    }
}

