package fr.yha.portfoliocore.config;

import freemarker.template.Configuration;
import freemarker.template.TemplateExceptionHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.core.io.ResourceLoader;


@org.springframework.context.annotation.Configuration
@ComponentScan(basePackages = "fr.yha.portfoliocore")
public class TemplateConfig {

    @Autowired
    private ResourceLoader resourceLoader;

    @Bean
    public Configuration freemarkerConfiguration() {
        Configuration cfg = new Configuration(Configuration.VERSION_2_3_28);

        try {
            // Set the Spring's resource loader
            cfg.setClassLoaderForTemplateLoading(resourceLoader.getClassLoader(), "templates");
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Could not load templates folder", e);
        }

        // Set recommended settings
        cfg.setDefaultEncoding("UTF-8");
        cfg.setTemplateExceptionHandler(TemplateExceptionHandler.RETHROW_HANDLER);
        cfg.setLogTemplateExceptions(false);
        cfg.setWrapUncheckedExceptions(true);

        return cfg;
    }
}
