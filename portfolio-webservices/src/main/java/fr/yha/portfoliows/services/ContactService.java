package fr.yha.portfoliows.services;


import fr.yha.portfoliows.component.ContactMailProperties;
import fr.yha.portfoliows.data.dto.ContactMailDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

@Service
public class ContactService {
    private static final Logger LOGGER = LoggerFactory.getLogger(ContactService.class);


    private final JavaMailSender emailSender;

    private final ContactMailProperties contactMailProperties;

    public ContactService(JavaMailSender emailSender, ContactMailProperties contactMailProperties) {
        this.emailSender = emailSender;
        this.contactMailProperties = contactMailProperties;
    }

    public void sendSimpleMessage(ContactMailDTO contactMailDTO, String htmlContent) throws MessagingException {
        MimeMessage mimeMessage = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
        helper.setFrom(this.contactMailProperties.getHostAddress());
        String recipientAddress = this.contactMailProperties.getRecieverAddress();
        LOGGER.info("Recipient Address: {}", recipientAddress);
        helper.setTo(recipientAddress);
        //helper.setTo(this.contactMailProperties.getRecieverAddress());
        helper.setSubject(contactMailDTO.getSubject());
        helper.setText(htmlContent, true);
        emailSender.send(mimeMessage);
    }
}