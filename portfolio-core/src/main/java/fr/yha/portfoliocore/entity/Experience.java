package fr.yha.portfoliocore.entity;

import javax.xml.bind.annotation.XmlElement;
import java.util.List;

public class Experience {
    private List<Job> jobs;

    public Experience() {
    }
    public Experience(List<Job> jobs) {
        this.jobs = jobs;
    }
    @XmlElement(name = "Job")
    public List<Job> getJobs() {
        return jobs;
    }

    public void setJobs(List<Job> jobs) {
        this.jobs = jobs;
    }
}
