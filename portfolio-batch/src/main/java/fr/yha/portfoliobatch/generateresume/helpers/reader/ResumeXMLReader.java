package fr.yha.portfoliobatch.generateresume.helpers.reader;

import fr.yha.portfoliocore.entity.Resume;
import fr.yha.portfoliocore.services.ResumeDataReader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.annotation.BeforeStep;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.ItemReader;
import org.springframework.stereotype.Component;

import javax.xml.bind.JAXBException;
import java.io.IOException;

@Component
@StepScope
public class ResumeXMLReader implements ItemReader<Resume> {

    private static final Logger logger = LoggerFactory.getLogger(ResumeXMLReader.class);
    private final ResumeDataReader resumeDataReader;
    private boolean isDataRead;

    public ResumeXMLReader(ResumeDataReader resumeDataReader) {
        this.resumeDataReader = resumeDataReader;
    }

    public boolean getDataRead() {
        return isDataRead;
    }

    public void setDataRead(boolean isDataRead) {
        this.isDataRead = isDataRead;
    }

    @BeforeStep
    public void retrieveJobParameters(StepExecution stepExecution) {
        JobParameters jobParameters = stepExecution.getJobParameters();
        this.setDataRead(Boolean.valueOf(jobParameters.getString("isDataRead")));
        logger.info("Job Parameter 'isDataRead': {}", this.isDataRead);
    }

    @Override
    public Resume read() throws JAXBException, IOException {
        try {
            logger.info("Attempting to read XML data. isDataRead: {}", this.isDataRead);
            Resume resume = this.resumeDataReader.readResumeXMLData(this.isDataRead);
            this.setDataRead(true);
            logger.info("Data read successfully, setting isDataRead to true");
            return resume;
        } catch (JAXBException | IOException e) {
            logger.error("Error while reading XML data. Exception: {}", e.getMessage(), e);
            throw e;
        }
    }
}
