package fr.yha.portfoliows.component;

import fr.yha.portfoliows.data.dto.ContactMailDTO;
import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Component
public class ContactMailTemplateProcessor {


    private static final Logger LOGGER = LoggerFactory.getLogger(ContactMailTemplateProcessor.class.getName());
    private final Configuration freemarkerConfiguration;


    public ContactMailTemplateProcessor(Configuration freemarkerConfiguration) {
        this.freemarkerConfiguration = freemarkerConfiguration;
    }



    public String processMailWithTemplate(ContactMailDTO contactMailDTO, String templateName) {
        try {
            File contactTemplateDir = new File(Objects.requireNonNull(this.getClass().getResource("/templates/contact-mail")).getPath());
            freemarkerConfiguration.setDirectoryForTemplateLoading(contactTemplateDir);
            Template template = freemarkerConfiguration.getTemplate(templateName);

            Map<String, Object> model = new HashMap<>();
            model.put("contact", contactMailDTO);
            StringWriter writer = new StringWriter();
            template.process(model, writer);

            return writer.toString();
        } catch (IOException | TemplateException ex) {
            handleException("Error processing mail template:", ex);
            return "";
        }
    }

    private void handleException(String message, Exception ex) {
        LOGGER.error(message, ex);
    }
}
