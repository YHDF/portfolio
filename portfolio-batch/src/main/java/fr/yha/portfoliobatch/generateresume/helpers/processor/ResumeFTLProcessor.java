package fr.yha.portfoliobatch.generateresume.helpers.processor;

import fr.yha.portfoliocore.entity.Resume;
import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Component
@StepScope
public class ResumeFTLProcessor implements ItemProcessor<Resume, String> {

    private static final Logger logger = LoggerFactory.getLogger(ResumeFTLProcessor.class);

    private final Configuration freemarkerConfiguration;

    public ResumeFTLProcessor(Configuration freemarkerConfiguration) {
        this.freemarkerConfiguration = freemarkerConfiguration;
    }

    @Override
    public String process(Resume resume) throws Exception {
        try {
            logger.info("Processing resume for: {}", resume != null ? resume.getPerson().getName() : "unknown");

            // Get the template by name
            Template temp = freemarkerConfiguration.getTemplate("resume.ftl");

            // Create a StringWriter to hold the HTML
            Writer stringWriter = new StringWriter();

            // Prepare the data model (if needed)
            Map<String, Object> model = new HashMap<>();
            resume.getExperience().getJobs().forEach(job -> {
                if(job.getDescription().contains(";")){
                    job.setDescriptionList(Arrays.asList(job.getDescription().split(";")));
                }
            });
            model.put("resume", resume);

            // Populate model with data (example: model.put("name", "John Doe");)

            // Merge data-model with template and write to StringWriter
            temp.process(model, stringWriter);

            // Return the HTML string as a ResponseEntity
            return stringWriter.toString();

        } catch (IOException | TemplateException e) {
            logger.error("Error processing resume for: {}. Exception: {}", resume != null ? resume.getPerson().getName() : "unknown", e.getMessage(), e);
            // Handle exceptions appropriately, possibly returning an error response
            return "";
        }
    }
}
