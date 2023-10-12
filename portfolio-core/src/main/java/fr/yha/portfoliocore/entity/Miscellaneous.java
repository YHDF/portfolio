package fr.yha.portfoliocore.entity;

import javax.xml.bind.annotation.XmlElement;

public class Miscellaneous {

    private String item;

    public Miscellaneous() {
    }

    public Miscellaneous(String item) {
        this.item = item;
    }

    @XmlElement(name = "Item")
    public String getItem() {
        return item;
    }

    public void setItem(String item) {
        this.item = item;
    }
}
