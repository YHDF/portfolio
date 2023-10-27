package fr.yha.portfoliows.webservices.controller;


import fr.yha.portfoliows.data.dto.ContactMailDTO;
import fr.yha.portfoliows.webservices.gateway.ContactGateway;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/contact")
public class ContactController {

    @Autowired
    ContactGateway contactGateway;


    @PostMapping("/send")
    public ResponseEntity<String> sendEmail(@RequestBody ContactMailDTO contactMailDTO){
        try {
            this.contactGateway.sendEmail(contactMailDTO);
            String successResponseMessage = "Your message was sent succesfully.";
            return ResponseEntity.status(HttpStatus.CREATED).body(successResponseMessage);
        }catch (Exception ex){
            String errorResponseMessage = "An error occured while sending your message, an automatic retry is scheduled for later.";
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(errorResponseMessage);
        }
    }
}
