package fr.yha.portfoliows.services;

import fr.yha.portfoliocore.component.ResumeProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.task.TaskExecutor;
import org.springframework.stereotype.Service;

import javax.inject.Named;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.CompletableFuture;


@Service
public class ResumeService {

    private static final Logger LOGGER = LoggerFactory.getLogger(ResumeService.class);
    private final JobLauncher jobLauncher;
    private final Job resumeGenerationJob;
    private final ResumeProperties resumeProperties;

    private final TaskExecutor taskExecutor;

    @Autowired
    public ResumeService(JobLauncher jobLauncher, @Named("portfolioGenerateResume") Job resumeGenerationJob, ResumeProperties resumeProperties, TaskExecutor taskExecutor) {
        this.jobLauncher = jobLauncher;
        this.resumeGenerationJob = resumeGenerationJob;
        this.resumeProperties = resumeProperties;
        this.taskExecutor = taskExecutor;
    }

    /**
     * Launches the resume generation job with appropriate parameters.
     */
    public CompletableFuture<Void> launchResumeGenerationJob(String version) {
        return CompletableFuture.runAsync(() -> {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String date = sdf.format(new Date());
            boolean isFrenchVersion = version.equalsIgnoreCase("FR");

            JobParameters jobParameters = new JobParametersBuilder()
                    .addString("genDate", date)
                    .addString("fileName", this.resumeProperties.getResumeFileName(isFrenchVersion))
                    .addString("isFrenchVersion", String.valueOf(isFrenchVersion))
                    .toJobParameters();
            try {

                jobLauncher.run(resumeGenerationJob, jobParameters);
                LOGGER.info("Job launched successfully with parameters: {}", jobParameters);

            } catch (Exception e) {
                LOGGER.error("Error launching job with parameters: {}", jobParameters, e);
                e.printStackTrace();
            }
        }, taskExecutor);
    }
}
