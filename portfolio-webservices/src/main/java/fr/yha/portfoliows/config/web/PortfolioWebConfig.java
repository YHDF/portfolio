package fr.yha.portfoliows.config.web;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class PortfolioWebConfig implements WebMvcConfigurer {

    private static final Logger LOGGER = LoggerFactory.getLogger(PortfolioWebConfig.class);

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        LOGGER.info("Configuring CORS mappings...");

        registry.addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("Content-Type", "X-Requested-With", "accept", "Origin", "Access-Control-Request-Method",
                        "Access-Control-Request-Headers")
                .exposedHeaders("Access-Control-Allow-Origin", "Access-Control-Allow-Credentials")
                .allowCredentials(false)
                .maxAge(3600);


        LOGGER.info("CORS mappings configured successfully:");
        LOGGER.info("- Allowed Origin Patterns: *");
        LOGGER.info("- Allowed Methods: GET, POST, PUT, DELETE, OPTIONS");
        LOGGER.info("- Allowed Headers: *");
        LOGGER.info("- Allow Credentials: false");
        LOGGER.info("- Max Age: 180");
    }
}

