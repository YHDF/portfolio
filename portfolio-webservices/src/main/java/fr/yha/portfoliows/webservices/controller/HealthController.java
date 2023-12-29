package fr.yha.portfoliows.webservices.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/health")
public class HealthController {

    private static final Logger LOGGER = LoggerFactory.getLogger(ContactController.class);


    @GetMapping
    public ResponseEntity<String> checkHealth() {
        LOGGER.info("Received request to check My webservice status.");
        String healthStatus = "Application is healthy!";
        return ResponseEntity.ok(healthStatus);
    }
}
