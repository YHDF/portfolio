package fr.yha.portfolio.config.json;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JacksonConfig {

    private static final Logger LOGGER = LoggerFactory.getLogger(JacksonConfig.class);

    @Bean
    public ObjectMapper objectMapper() {
        LOGGER.info("Configuring ObjectMapper...");

        ObjectMapper objectMapper = new ObjectMapper();

        objectMapper.registerModule(new JavaTimeModule());
        LOGGER.debug("Registered JavaTimeModule with ObjectMapper.");

        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        LOGGER.debug("Configured ObjectMapper to ignore unknown properties in JSON input.");

        objectMapper.enable(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT);
        LOGGER.debug("Configured ObjectMapper to treat empty strings as null objects.");

        objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        LOGGER.debug("Configured ObjectMapper not to serialize null values.");

        LOGGER.info("ObjectMapper configured and initialized successfully.");
        return objectMapper;
    }
}

