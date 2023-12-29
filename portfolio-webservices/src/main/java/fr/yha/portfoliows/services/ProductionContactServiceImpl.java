package fr.yha.portfoliows.services;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import fr.yha.portfoliocore.config.PropertyConfig;
import fr.yha.portfoliows.component.ContactMailProperties;
import fr.yha.portfoliows.data.dto.ContactMailDTO;
import fr.yha.portfoliows.services.interfaces.ContactService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.mail.MessagingException;
import java.io.IOException;

@Service
@Profile("production")
public class ProductionContactServiceImpl implements ContactService {

    private static final Logger LOGGER = LoggerFactory.getLogger(ProductionContactServiceImpl.class);
    private final SendGrid sendGrid;
    private final ContactMailProperties contactMailProperties;

    @Value("${spring.profiles.active}")
    private String activeProfile;

    @Autowired
    public ProductionContactServiceImpl(ContactMailProperties contactMailProperties, PropertyConfig propertyConfig) {
        this.sendGrid = new SendGrid(propertyConfig.getSendGridApiKey());
        this.contactMailProperties = contactMailProperties;
    }


    @Override
    @PostConstruct
    public void setup() {
        LOGGER.info("---------------------------------------------------------------------------------------");
        LOGGER.info("Using {} profile, Service {} will be loaded", activeProfile, this.getClass().getName());
        LOGGER.info("---------------------------------------------------------------------------------------");
    }

    @Override
    public void sendSimpleMessage(ContactMailDTO contactMailDTO, String htmlContent) throws MessagingException {
        String senderAddress = this.contactMailProperties.getHostAddress();
        LOGGER.info("Sender Address: {}", senderAddress);

        Email from = new Email(senderAddress);
        String recipientAddress = this.contactMailProperties.getRecieverAddress();
        LOGGER.info("Recipient Address: {}", recipientAddress);
        Email to = new Email(recipientAddress);
        String subject = contactMailDTO.getSubject();
        Content content = new Content("text/html", htmlContent);
        Mail mail = new Mail(from, subject, to, content);

        Request request = new Request();
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = this.sendGrid.api(request);

            LOGGER.info(String.valueOf(response.getStatusCode()));
            LOGGER.info(response.getBody());
            LOGGER.info(response.getHeaders().toString());

            // Check for SendGrid API success response
            if (response.getStatusCode() >= 200 && response.getStatusCode() < 300) {
                LOGGER.info("Email sent successfully!");
            } else {
                LOGGER.error("Failed to send email. SendGrid API response: {}", response.getBody());
            }

        } catch (IOException ex) {
            LOGGER.error("Error sending email: {}", ex.getMessage(), ex);
            throw new MessagingException("Error sending email", ex);
        }
    }

    @Override
    public void sendAutoResponseSimpleMessage(ContactMailDTO contactMailDTO, String htmlContent, String recieverAddress) throws MessagingException {
        String senderAddress = this.contactMailProperties.getHostAddress();
        LOGGER.info("Sender Address: {}", senderAddress);
        Email from = new Email(senderAddress, contactMailDTO.getSenderName());
        String subject = contactMailDTO.getSubject();
        Email to = new Email(recieverAddress);
        Content content = new Content("text/html", htmlContent);
        Mail mail = new Mail(from, subject, to, content);

        Request request = new Request();
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = this.sendGrid.api(request);

            LOGGER.info(String.valueOf(response.getStatusCode()));
            LOGGER.info(response.getBody());
            LOGGER.info(response.getHeaders().toString());

            // Check for SendGrid API success response
            if (response.getStatusCode() >= 200 && response.getStatusCode() < 300) {
                LOGGER.info("Auto-response email sent successfully!");
            } else {
                LOGGER.error("Failed to send auto-response email. SendGrid API response: {}", response.getBody());
            }

        } catch (IOException ex) {
            LOGGER.error("Error sending auto-response email: {}", ex.getMessage(), ex);
            throw new MessagingException("Error sending auto-response email", ex);
        }
    }


    @Override
    public ContactMailProperties getContactMailProperties() {
         return contactMailProperties;
    }
}
