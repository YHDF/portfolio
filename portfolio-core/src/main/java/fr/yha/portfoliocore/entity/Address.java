package fr.yha.portfoliocore.entity;

import javax.xml.bind.annotation.XmlElement;

public class Address {

    private String street;
    private String city;
    private String country;

    public Address() {

    }

    public Address(String street, String city, String country) {
        street = street;
        city = city;
        country = country;
    }

    @XmlElement(name = "Street")
    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    @XmlElement(name = "City")
    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    @XmlElement(name = "Country")
    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }
}
