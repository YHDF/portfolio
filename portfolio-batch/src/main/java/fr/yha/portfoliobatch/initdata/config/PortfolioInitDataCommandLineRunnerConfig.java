package fr.yha.portfoliobatch.initdata.config;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Configuration
@ConditionalOnProperty(name = "command.line.batch.enabled", havingValue = "true")
public class PortfolioInitDataCommandLineRunnerConfig {
    private final JobLauncher jobLauncher;

    private final Job portfolioInitData;

    public PortfolioInitDataCommandLineRunnerConfig(JobLauncher jobLauncher, Job portfolioInitData) {
        this.jobLauncher = jobLauncher;
        this.portfolioInitData = portfolioInitData;
    }


    @Bean
    public CommandLineRunner commandLineRunner() {
        return args -> {
            // Check for command line arguments and use them to build job parameters
            if (args.length > 1) {
                System.err.println("Usage: java -jar fr.yha.portfoliobatch.initData.PortfolioInitdataApplication : too many arguments");
                return;
            }


            LocalDateTime timestamp = LocalDateTime.now();
            String executionId = timestamp.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));



            // Build job parameters
            JobParameters jobParameters = new JobParametersBuilder()
                    .addString("executionId", executionId) // Add a unique identifier
                    .toJobParameters();


            jobLauncher.run(portfolioInitData, jobParameters);
        };
    }
}
