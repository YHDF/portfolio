package fr.yha.portfoliocore.entity;

import javax.xml.bind.annotation.XmlElement;
import java.util.List;

public class Education {

    private List<Degree> degrees;

    public Education() {

    }

    public Education(List<Degree> degrees) {
        this.degrees = degrees;
    }

    @XmlElement(name = "Degree")
    public List<Degree> getDegrees() {
        return degrees;
    }

    public void setDegrees(List<Degree> degrees) {
        this.degrees = degrees;
    }
}
