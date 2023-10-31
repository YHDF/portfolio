package fr.yha.portfoliocore.entity;

import javax.xml.bind.annotation.XmlElement;

public class Item {

    private String title;

    private String description;

    @XmlElement(name = "Title")
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
    @XmlElement(name = "Description")
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
