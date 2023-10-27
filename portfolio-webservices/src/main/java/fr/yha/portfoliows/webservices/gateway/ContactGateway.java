package fr.yha.portfoliows.webservices.gateway;


import fr.yha.portfoliows.component.ContactMailTemplateProcessor;
import fr.yha.portfoliows.data.dto.ContactMailDTO;
import fr.yha.portfoliows.services.ContactService;
import freemarker.template.TemplateException;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import java.io.IOException;

@Service
public class ContactGateway {


    private final ContactMailTemplateProcessor contactMailTemplateProcessor;

    private final ContactService contactService;


    public ContactGateway(ContactMailTemplateProcessor contactMailTemplateProcessor, ContactService contactService) {
        this.contactMailTemplateProcessor = contactMailTemplateProcessor;
        this.contactService = contactService;
    }

    public void sendEmail(ContactMailDTO contactMailDTO) throws TemplateException, IOException, MessagingException {
        String htmlContent = this.contactMailTemplateProcessor.processMailWithTemplate(contactMailDTO);
        this.contactService.sendSimpleMessage(contactMailDTO, htmlContent);
    }
}
