package fr.yha.portfoliocore.entity;

import javax.xml.bind.annotation.XmlElement;

public class Degree {
    private String duration;
    private String program;
    private String institution;

    @XmlElement(name = "Duration")
    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    @XmlElement(name = "Program")
    public String getProgram() {
        return program;
    }

    public void setProgram(String program) {
        this.program = program;
    }

    @XmlElement(name = "Institution")
    public String getInstitution() {
        return institution;
    }

    public void setInstitution(String institution) {
        this.institution = institution;
    }
}
