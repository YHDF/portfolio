package fr.yha.portfoliocore.component;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

@Component
public class ResumeProperties {

    @Value("${resume.file.name.fr}")
    private String frenchResumeFileName;

    @Value("${resume.file.name.en}")
    private String englishResumeFileName;

    @Value("${resume.image.directory}")
    private String resumeImageDirectory;

    @Value("${resume.file.path}")
    private String resumeFilePath;

    @Value("classpath:xml-data/resume_fr.xml")
    private Resource frenchVersionResource;

    @Value("classpath:xml-data/resume_en.xml")
    private Resource englishVersionResource;

    public String getFrenchResumeFileName() {
        return frenchResumeFileName;
    }

    public String getEnglishResumeFileName() {
        return englishResumeFileName;
    }

    public String getResumeImageDirectory() {
        return resumeImageDirectory;
    }

    public String getResumeFilePath() {
        return resumeFilePath;
    }

    public Resource getFrenchVersionResource() {
        return frenchVersionResource;
    }

    public Resource getEnglishVersionResource() {
        return englishVersionResource;
    }

    public String getResumeFileName(boolean isResouceFrench) {
        return isResouceFrench ? this.frenchResumeFileName : this.englishResumeFileName;
    }

    public Resource getResource(boolean isResouceFrench) {
        return isResouceFrench ? this.frenchVersionResource : this.englishVersionResource;
    }
}
