package fr.yha.portfoliocore.entity;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;

@XmlRootElement(name = "Resume")
public class Resume {
    private Person person;
    private List<Skill> skills;
    private Experience experience;
    private Education education;
    private Miscellaneous miscellaneous;
    public Resume() {

    }
    public Resume(Person person, List<Skill> skills, Experience experience, Education education, Miscellaneous miscellaneous) {
        this.person = person;
        this.skills = skills;
        this.experience = experience;
        this.education = education;
        this.miscellaneous = miscellaneous;
    }

    @XmlElement(name = "Person")
    public Person getPerson() { return person; }
    public void setPerson(Person person) { this.person = person; }

    @XmlElementWrapper(name = "Skills")
    @XmlElement(name = "Skill")
    public List<Skill> getSkills() { return skills; }
    public void setSkills(List<Skill> skills) { this.skills = skills; }

    @XmlElement(name = "Experience")
    public Experience getExperience() { return experience; }
    public void setExperience(Experience experience) { this.experience = experience; }

    @XmlElement(name = "Education")
    public Education getEducation() { return education; }
    public void setEducation(Education education) { this.education = education; }

    @XmlElement(name = "Miscellaneous")
    public Miscellaneous getMiscellaneous() { return miscellaneous; }
    public void setMiscellaneous(Miscellaneous miscellaneous) { this.miscellaneous = miscellaneous; }

}

