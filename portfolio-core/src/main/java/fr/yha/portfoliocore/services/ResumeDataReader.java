package fr.yha.portfoliocore.services;


import fr.yha.portfoliocore.component.ResumeProperties;
import fr.yha.portfoliocore.entity.Resume;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import java.io.IOException;
import java.io.InputStream;

@Service
public class ResumeDataReader {

    private static final Logger LOGGER = LoggerFactory.getLogger(ResumeDataReader.class);
    private final ResumeProperties resumeProperties;


    @Autowired
    public ResumeDataReader( ResumeProperties resumeProperties) {
        this.resumeProperties = resumeProperties;
    }


    /**
     * Reads the resume data from the XML file.
     *
     * @throws IOException if the job is already running
     * @throws JAXBException if the job is restarted
     */
    public Resume readResumeXMLData(boolean isDataRead, boolean isFrenchVersion) throws JAXBException, IOException {
        if (isDataRead) {
            LOGGER.warn("Data has already been read, returning null.");
            return null;
        }

        JAXBContext context;
        Unmarshaller unmarshaller;
        try {
            context = JAXBContext.newInstance(Resume.class);
            unmarshaller = context.createUnmarshaller();
        } catch (JAXBException e) {
            LOGGER.error("Error initializing JAXB Context and Unmarshaller: {}", e.getMessage(), e);
            throw e;
        }

        try (InputStream is = this.resumeProperties.getResource(isFrenchVersion).getInputStream()) {
            Resume resume = (Resume) unmarshaller.unmarshal(is);
            LOGGER.info("Resume data successfully read from XML.");
            return resume;
        } catch (IOException e) {
            LOGGER.error("Error obtaining input stream from resource: {}", e.getMessage(), e);
            throw e;
        } catch (JAXBException e) {
            LOGGER.error("Error unmarshalling XML data: {}", e.getMessage(), e);
            throw e;
        }
    }

}
