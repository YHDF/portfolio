package fr.yha.portfoliocore.entity;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlValue;

public class Skill {
    private String type;
    private String value;

    @XmlAttribute(name = "type")
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    @XmlValue
    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }
}
