package fr.yha.portfoliocore.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;

import javax.annotation.PostConstruct;

@Configuration
@Primary
@PropertySources({
        @PropertySource("classpath:jdbc${property.environment.suffix:}.properties"),
        @PropertySource("classpath:resume${property.environment.suffix:}.properties"),
        @PropertySource("classpath:mail${property.environment.suffix:}.properties"),
        @PropertySource("classpath:vault${property.environment.suffix:}.properties"),
})
public class PropertyConfig {

    private static final Logger LOGGER = LoggerFactory.getLogger(PropertyConfig.class);

    @Value("${portfolio.run.enviroment}")
    private String portfolioRunEnv;

    @Value("${spring.sendgrid.api-key}")
    private String sendGridApiKey;

    @Bean
    public static PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
        return new PropertySourcesPlaceholderConfigurer();
    }

    @PostConstruct
    void init() {
        LOGGER.info("---------------------------------------------------------------------------------------");
        LOGGER.info("                            Running in {} environment", portfolioRunEnv);
        LOGGER.info("---------------------------------------------------------------------------------------");
    }

    public String getPortfolioRunEnv() {
        return portfolioRunEnv;
    }

    public String getSendGridApiKey() {
        return sendGridApiKey;
    }
}
