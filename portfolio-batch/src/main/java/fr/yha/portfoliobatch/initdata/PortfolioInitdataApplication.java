package fr.yha.portfoliobatch.initdata;

import fr.yha.portfoliocore.config.JpaConfig;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@EnableBatchProcessing
@Import({JpaConfig.class})
public class PortfolioInitdataApplication {

	public static void main(String[] args) {
		SpringApplication.run(PortfolioInitdataApplication.class, args);
	}

}
