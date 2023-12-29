package fr.yha.portfoliows.services;

import fr.yha.portfoliows.component.ContactMailProperties;
import fr.yha.portfoliows.data.dto.ContactMailDTO;
import fr.yha.portfoliows.services.interfaces.ContactService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

@Service
@Profile({"development", "default"})
public class DevContactServiceImpl implements ContactService {
    private static final Logger LOGGER = LoggerFactory.getLogger(DevContactServiceImpl.class);

    @Value("${spring.profiles.active}")
    private String activeProfile;

    private final JavaMailSender emailSender;
    private final ContactMailProperties contactMailProperties;

    public DevContactServiceImpl(JavaMailSender emailSender, ContactMailProperties contactMailProperties) {
        this.emailSender = emailSender;
        this.contactMailProperties = contactMailProperties;
    }

    @Override
    @PostConstruct
    public void setup() {
        LOGGER.info("---------------------------------------------------------------------------------------");
        LOGGER.info("Using {} profile, Service {} will be loaded", activeProfile, this.getClass().getName());
        LOGGER.info("---------------------------------------------------------------------------------------");
    }

    public ContactMailProperties getContactMailProperties() {
        return contactMailProperties;
    }

    public void sendSimpleMessage(ContactMailDTO contactMailDTO, String htmlContent) {
        try {
            MimeMessage mimeMessage = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
            helper.setFrom(this.contactMailProperties.getHostAddress());
            String recipientAddress = this.contactMailProperties.getRecieverAddress();
            LOGGER.info("Recipient Address: {}", recipientAddress);
            helper.setTo(recipientAddress);
            helper.setSubject(contactMailDTO.getSubject());
            helper.setText(htmlContent, true);
            emailSender.send(mimeMessage);
            LOGGER.info("Email sent successfully!");
        } catch (MessagingException ex) {
            LOGGER.error("Error sending email: {}", ex.getMessage(), ex);
        }
    }

    public void sendAutoResponseSimpleMessage(ContactMailDTO contactMailDTO, String htmlContent, String recieverAddress) {
        try {
            MimeMessage mimeMessage = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
            helper.setFrom(this.contactMailProperties.getHostAddress());
            LOGGER.info("Recipient Address: {}", recieverAddress);
            helper.setTo(recieverAddress);
            helper.setSubject(contactMailDTO.getSubject());
            helper.setText(htmlContent, true);
            emailSender.send(mimeMessage);
            LOGGER.info("Auto-response email sent successfully!");
        } catch (MessagingException ex) {
            LOGGER.error("Error sending auto-response email: {}", ex.getMessage(), ex);
        }
    }
}
