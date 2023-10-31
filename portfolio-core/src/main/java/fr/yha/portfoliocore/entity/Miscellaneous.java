package fr.yha.portfoliocore.entity;

import javax.xml.bind.annotation.XmlElement;
import java.util.List;

public class Miscellaneous {

    private List<Item> items;

    public Miscellaneous() {
    }

    public Miscellaneous(List<Item> items) {
        this.items = items;
    }

    @XmlElement(name = "Item")
    public List<Item> getItems() {
        return items;
    }

    public void setItems(List<Item> items) {
        this.items = items;
    }
}
