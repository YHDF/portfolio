package fr.yha.portfoliows.config.mail;


import fr.yha.portfoliows.component.ContactMailProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class SpringMailConfig {


    @Autowired
    private ContactMailProperties mailProperties;


    @Bean
    public JavaMailSender getJavaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(mailProperties.getHostDomain());
        mailSender.setPort(Integer.parseInt(mailProperties.getHostPort()));

        mailSender.setUsername(mailProperties.getHostAddress());
        mailSender.setPassword(mailProperties.getHostPassword());

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.debug", "true");

        return mailSender;
    }
}
