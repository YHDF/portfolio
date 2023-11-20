package fr.yha.portfoliobatch.initdata;

import fr.yha.portfoliobatch.initdata.config.PortfolioInitDataCommandLineRunnerConfig;
import fr.yha.portfoliocore.config.JpaConfig;
import fr.yha.portfoliocore.config.PropertyConfig;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@EnableBatchProcessing
@Import({PropertyConfig.class, JpaConfig.class, PortfolioInitDataCommandLineRunnerConfig.class})
public class PortfolioInitdataApplication {

	public static void main(String[] args) {
		SpringApplication.run(PortfolioInitdataApplication.class, args);
	}

}
