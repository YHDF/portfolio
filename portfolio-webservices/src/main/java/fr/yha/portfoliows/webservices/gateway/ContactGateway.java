package fr.yha.portfoliows.webservices.gateway;


import fr.yha.portfoliows.component.ContactMailTemplateProcessor;
import fr.yha.portfoliows.data.dto.ContactMailDTO;
import fr.yha.portfoliows.services.interfaces.ContactService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;


@Service
public class ContactGateway {

    private static final Logger LOGGER = LoggerFactory.getLogger(ContactGateway.class);

    private final ContactMailTemplateProcessor contactMailTemplateProcessor;
    private final ContactService contactService;

    public ContactGateway(ContactMailTemplateProcessor contactMailTemplateProcessor, ContactService contactService) {
        this.contactMailTemplateProcessor = contactMailTemplateProcessor;
        this.contactService = contactService;
    }

    public String sendEmail(ContactMailDTO contactMailDTO, String templateName) {
        try {
            String htmlContent = this.contactMailTemplateProcessor.processMailWithTemplate(contactMailDTO, templateName);
            this.contactService.sendSimpleMessage(contactMailDTO, htmlContent);
        } catch (MessagingException ex) {
            handleException("Error sending email:", ex);
        }
        return "Successfully sent first email.";
    }

    public String sendAutoReplyEmail(ContactMailDTO contactMailDTO, String templateName) {
        //Nous convertissons l'adresse de l'expéditeur de mon site web en l'adresse du destinataire de la réponse automatique par e-
        String recepientAddress = contactMailDTO.getSenderMail();
        contactMailDTO.setSenderMail(this.contactService.getContactMailProperties().getContactPersonalEmail());
        // Le modèle pour la réponse automatique générique se trouve dans le fichier contact-auto-reply.ftl. Pas besoin de setter le message
        contactMailDTO.setMessage(null);
        try {
            String htmlContent = this.contactMailTemplateProcessor.processMailWithTemplate(contactMailDTO, templateName);
            this.contactService.sendAutoResponseSimpleMessage(contactMailDTO, htmlContent, recepientAddress);
        } catch (MessagingException ex) {
            handleException("Error sending auto-reply email:", ex);
        }
        return "Successfully sent auto email.";
    }

    private void handleException(String message, Exception ex) {
        LOGGER.error(message, ex);
    }
}
