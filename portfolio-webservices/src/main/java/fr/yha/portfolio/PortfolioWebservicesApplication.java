package fr.yha.portfolio;

import fr.yha.portfolio.config.clients.FeignClientConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Import;
import org.springframework.web.WebApplicationInitializer;


@SpringBootApplication
@Import(FeignClientConfig.class)
public class PortfolioWebservicesApplication extends SpringBootServletInitializer implements WebApplicationInitializer {
	public static void main(String[] args) {
		SpringApplication.run(PortfolioWebservicesApplication.class, args);
	}
}
