package fr.yha.portfoliows;

import fr.yha.portfoliocore.config.JpaConfig;
import fr.yha.portfoliocore.config.PropertyConfig;
import fr.yha.portfoliocore.config.TemplateConfig;
import fr.yha.portfoliows.config.client.FeignClientConfig;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.batch.BatchAutoConfiguration;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Import;
import org.springframework.web.WebApplicationInitializer;


@SpringBootApplication(scanBasePackages = {"fr.yha.portfoliows","fr.yha.portfoliobatch.generateresume"}, exclude = {BatchAutoConfiguration.class})
@Import({FeignClientConfig.class, JpaConfig.class, TemplateConfig.class, PropertyConfig.class})
@EnableBatchProcessing
public class PortfolioWebservicesApplication extends SpringBootServletInitializer implements WebApplicationInitializer {
	public static void main(String[] args) {
		SpringApplication.run(PortfolioWebservicesApplication.class, args);
	}
}
