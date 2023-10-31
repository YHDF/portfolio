package fr.yha.portfoliobatch.generateresume.config;

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
public class PortfolioResumeCommandLineRunnerConfig {
    private final JobLauncher jobLauncher;

    private final Job portfolioGenerateResume;

    public PortfolioResumeCommandLineRunnerConfig(JobLauncher jobLauncher, Job portfolioGenerateResume) {
        this.jobLauncher = jobLauncher;
        this.portfolioGenerateResume = portfolioGenerateResume;
    }


    @Bean
    public CommandLineRunner commandLineRunner() {
        return args -> {
            // Check for command line arguments and use them to build job parameters
            if (args.length < 2) {
                System.err.println("Usage: java -jar fr.yha.portfoliobatch.generateresume.PortfolioGenerateResumeApplication : too many arguments");
                return;
            }


            LocalDateTime timestamp = LocalDateTime.now();
            String executionId = timestamp.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));

            String isDataRead = null;
            String isFrenchVersion = null;

            for (String arg : args) {
                if (arg.startsWith("--isFrenchVersion=")) {
                    isFrenchVersion = arg.substring("--isFrenchVersion=".length());
                } else if (arg.startsWith("--isDataRead=")) {
                    isDataRead = arg.substring("--isDataRead=".length());
                }
            }

            // Build job parameters
            JobParameters jobParameters = new JobParametersBuilder()
                    .addString("isFrenchVersion", isFrenchVersion.toString())
                    .addString("isDataRead", isDataRead.toString())
                    .addString("executionId", executionId) // Add a unique identifier
                    .toJobParameters();


            jobLauncher.run(portfolioGenerateResume, jobParameters);
        };
    }
}
