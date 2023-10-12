package fr.yha.portfoliocore.entity;

import javax.xml.bind.annotation.XmlElement;

public class Person {
    private String name;
    private String title;
    private String experience;
    //private String image;
    private Address address;
    private String phone;
    private String description;

    private String email;
    public Person() {

    }
    public Person(String name, String title, String experience, Address address, String phone, String description, String email) {
        this.name = name;
        this.title = title;
        this.experience = experience;
        this.address = address;
        this.phone = phone;
        this.description = description;
        this.email = email;
    }

    @XmlElement(name = "Name")
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @XmlElement(name = "Title")
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @XmlElement(name = "Experience")
    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    @XmlElement(name = "Address")
    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    @XmlElement(name = "Phone")
    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    @XmlElement(name = "Description")
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @XmlElement(name = "Email")
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
