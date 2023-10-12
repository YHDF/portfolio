package fr.yha.portfolio.services;

import fr.yha.portfoliocore.component.ResumeProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.JobParametersInvalidException;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.repository.JobExecutionAlreadyRunningException;
import org.springframework.batch.core.repository.JobInstanceAlreadyCompleteException;
import org.springframework.batch.core.repository.JobRestartException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.inject.Named;
import java.text.SimpleDateFormat;
import java.util.Date;


@Service
public class ResumeService {

    private static final Logger LOGGER = LoggerFactory.getLogger(ResumeService.class);
    private final JobLauncher jobLauncher;
    private final Job resumeGenerationJob;
    private final ResumeProperties resumeProperties;

    @Autowired
    public ResumeService(JobLauncher jobLauncher, @Named("portfolioGenerateResume") Job resumeGenerationJob, ResumeProperties resumeProperties) {
        this.jobLauncher = jobLauncher;
        this.resumeGenerationJob = resumeGenerationJob;
        this.resumeProperties = resumeProperties;
    }

    /**
     * Launches the resume generation job with appropriate parameters.
     *
     * @throws JobExecutionAlreadyRunningException if the job is already running
     * @throws JobRestartException if the job is restarted
     * @throws JobInstanceAlreadyCompleteException if the instance is already complete
     * @throws JobParametersInvalidException if the parameters are invalid
     */
    public void launchResumeGenerationJob() throws JobExecutionAlreadyRunningException,
            JobRestartException,
            JobInstanceAlreadyCompleteException,
            JobParametersInvalidException {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String date = sdf.format(new Date());

        JobParameters jobParameters = new JobParametersBuilder()
                .addString("genDate", date)
                .addString("fileName", this.resumeProperties.getResumeFileName())
                .toJobParameters();

        try {
            jobLauncher.run(resumeGenerationJob, jobParameters);
            LOGGER.info("Job launched successfully with parameters: {}", jobParameters);
        } catch (Exception e) {
            LOGGER.error("Error launching job with parameters: {}", jobParameters, e);
            throw e;
        }
    }
}
