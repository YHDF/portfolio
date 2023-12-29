package fr.yha.portfoliows.services.interfaces;

import fr.yha.portfoliows.component.ContactMailProperties;
import fr.yha.portfoliows.data.dto.ContactMailDTO;

import javax.mail.MessagingException;

public interface ContactService {

    void setup();

    void sendSimpleMessage(ContactMailDTO contactMailDTO, String htmlContent) throws MessagingException;

    void sendAutoResponseSimpleMessage(ContactMailDTO contactMailDTO, String htmlContent, String recieverAddress) throws MessagingException;

    ContactMailProperties getContactMailProperties();
}
