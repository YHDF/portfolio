package fr.yha.portfoliows.webservices.controller;


import fr.yha.portfoliows.data.dto.ContactMailDTO;
import fr.yha.portfoliows.webservices.gateway.ContactGateway;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

@RestController
@RequestMapping(path = "/contact")
public class ContactController {

    private static final Logger LOGGER = LoggerFactory.getLogger(ContactController.class);

    @Autowired
    ContactGateway contactGateway;
    private final ExecutorService executor = Executors.newSingleThreadExecutor();

    @PostMapping(value = "/send", produces = "text/html")
    public ResponseEntity<String> sendEmail(@RequestBody ContactMailDTO contactMailDTO) {
        try {
            Future<String> firstEmailFuture = executor.submit(() -> this.contactGateway.sendEmail(contactMailDTO, "contact.ftl"));

            Future<String> autoEmailFuture = executor.submit(() -> this.contactGateway.sendAutoReplyEmail(contactMailDTO, "contact-auto-reply.ftl"));

            LOGGER.info("Waiting for first email to send...");
            String firstEmailMessage = firstEmailFuture.get();
            LOGGER.info(String.format("%s", firstEmailMessage));

            LOGGER.info("Waiting for auto email to send...");
            String autoEmailMessage = autoEmailFuture.get();
            LOGGER.info(String.format("%s", autoEmailMessage));

            String successResponseMessage = String.format("%s %s", firstEmailMessage, autoEmailMessage);
            return ResponseEntity.status(HttpStatus.OK).body(successResponseMessage);
        } catch (Exception ex) {
            handleException(ex);
            String errorResponseMessage = "An error occurred while sending your message, an automatic retry is scheduled for later.";
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(errorResponseMessage);
        }
    }

    private void handleException(Exception ex) {
        LOGGER.error("Error sending email:", ex);
    }
}
