package fr.yha.portfoliobatch.generateresume;

import fr.yha.portfoliobatch.generateresume.config.PortfolioResumeCommandLineRunnerConfig;
import fr.yha.portfoliocore.config.JpaConfig;
import fr.yha.portfoliocore.config.TemplateConfig;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@EnableBatchProcessing
@Import({JpaConfig.class, TemplateConfig.class, PortfolioResumeCommandLineRunnerConfig.class})
public class PortfolioGenerateResumeApplication {

	public static void main(String[] args) {
		SpringApplication.run(PortfolioGenerateResumeApplication.class, args);
	}
}
