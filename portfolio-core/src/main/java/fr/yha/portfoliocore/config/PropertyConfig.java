package fr.yha.portfoliocore.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;

import javax.annotation.PostConstruct;

@Configuration
@PropertySources({
        @PropertySource("classpath:${property.environment.folder:}/jdbc${property.environment.suffix:}.properties"),
        @PropertySource("classpath:${property.environment.folder:}/resume${property.environment.suffix:}.properties"),
        @PropertySource("classpath:${property.environment.folder:}/mail${property.environment.suffix:}.properties"),
        @PropertySource("classpath:${property.environment.folder:}/vault${property.environment.suffix:}.properties"),
})
public class PropertyConfig {

    private static final Logger LOGGER = LoggerFactory.getLogger(PropertyConfig.class);
    @Value("${portfolio.run.enviroment}")
    private String portfolioRunEnv;

    @Bean
    public static PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
        return new PropertySourcesPlaceholderConfigurer();
    }

    @PostConstruct
    void init() {
        LOGGER.info("---------------------------------------------------------------------------------------");
        LOGGER.info("--------------------------Running in {} environment------------------", portfolioRunEnv);
        LOGGER.info("---------------------------------------------------------------------------------------");
    }
}
