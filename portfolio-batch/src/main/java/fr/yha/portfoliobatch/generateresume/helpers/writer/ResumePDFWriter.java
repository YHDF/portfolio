package fr.yha.portfoliobatch.generateresume.helpers.writer;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import fr.yha.portfoliocore.component.ResumeProperties;
import org.jsoup.Jsoup;
import org.jsoup.helper.W3CDom;
import org.jsoup.nodes.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.annotation.BeforeStep;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.ItemWriter;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.nio.file.FileSystems;
import java.util.List;

import static fr.yha.portfoliobatch.generateresume.helpers.converter.ImagePathConverter.convertRelativePathsToAbsolute;
import static fr.yha.portfoliobatch.generateresume.helpers.converter.ImagePathConverter.getAllImageFiles;

@Component
@StepScope
public class ResumePDFWriter implements ItemWriter<String> {

    private static final Logger LOGGER = LoggerFactory.getLogger(ResumePDFWriter.class);
    private static final String EMPTY_STRING = "";

    private final ResumeProperties resumeProperties;

    private boolean isFrenchVersion;

    public boolean getFrenchVersion() {
        return isFrenchVersion;
    }

    public void setFrenchVersion(boolean isFrenchVersion) {
        this.isFrenchVersion = isFrenchVersion;
    }

    @BeforeStep
    public void retrieveJobParameters(StepExecution stepExecution) {
        JobParameters jobParameters = stepExecution.getJobParameters();
        if(jobParameters.getString("isFrenchVersion") != null && !jobParameters.getString("isFrenchVersion").equals("")){
            this.setFrenchVersion(Boolean.parseBoolean(jobParameters.getString("isFrenchVersion")));
        }else{
            this.setFrenchVersion(true);
        }
        LOGGER.info("Job Parameter 'isFrenchVersion': {}", this.isFrenchVersion);
    }

    public ResumePDFWriter(ResumeProperties resumeProperties) {
        this.resumeProperties = resumeProperties;
    }

    @Override
    public void write(List<? extends String> items) throws Exception {
        LOGGER.info("Starting writing process for {} items", items.size());
        for (String content : items) {
            writeContentToPdf(content);
        }
        LOGGER.info("Finished writing process for {} items", items.size());
    }

    private void writeContentToPdf(String content) throws Exception {
        String baseUrl = FileSystems.getDefault()
                .getPath("src/main/resources/")
                .toUri().toURL().toString();
        LOGGER.info("Base URL for resources: {}", baseUrl);

        List<File> images = getAllImageFiles(this.resumeProperties.getResumeImageDirectory());
        LOGGER.info("Total {} images found for conversion", images.size());

        String updatedContent = convertRelativePathsToAbsolute(content, images);
        Document document = Jsoup.parse(updatedContent, "UTF-8");
        document.outputSettings().syntax(Document.OutputSettings.Syntax.xml);
        String filePath = EMPTY_STRING.concat(this.resumeProperties.getResumeFilePath() + this.resumeProperties.getResumeFileName(this.isFrenchVersion));

        try (OutputStream os = new FileOutputStream(filePath)) {
            LOGGER.info("Initializing PDF rendering builder for file: {}", filePath);
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.withUri(filePath);
            builder.toStream(os);
            builder.withW3cDocument(new W3CDom().fromJsoup(document), baseUrl);
            builder.run();
            LOGGER.info("PDF successfully written to: {}", filePath);
        } catch (Exception e) {
            LOGGER.error("Error occurred while writing PDF to: {}. Exception: {}", filePath, e.getMessage(), e);
            throw e;
        }
    }
}
