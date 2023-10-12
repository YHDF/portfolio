package fr.yha.portfoliocore.component;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

@Component
@PropertySources({
        @PropertySource("classpath:resume.properties"),
})
public class ResumeProperties {

    @Value("${resume.file.name}")
    private String resumeFileName;

    @Value("${resume.image.directory}")
    private String resumeImageDirectory;

    @Value("${resume.file.path}")
    private String resumeFilePath;

    @Value("classpath:xml-data/resume.xml")
    private Resource resource;

    public String getResumeFileName() {
        return resumeFileName;
    }

    public String getResumeImageDirectory() {
        return resumeImageDirectory;
    }

    public String getResumeFilePath() {
        return resumeFilePath;
    }

    public Resource getResource() {
        return resource;
    }
}
