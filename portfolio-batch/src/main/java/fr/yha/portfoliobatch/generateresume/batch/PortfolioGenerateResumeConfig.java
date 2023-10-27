package fr.yha.portfoliobatch.generateresume.batch;


import fr.yha.portfoliocore.entity.Resume;
import fr.yha.portfoliocore.services.BatchJobEventListenerImpl;
import org.springframework.batch.core.ItemReadListener;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.inject.Named;

@Configuration
public class PortfolioGenerateResumeConfig {

    private final JobBuilderFactory jobBuilderFactory;
    private final StepBuilderFactory stepBuilderFactory;

    @Autowired
    public PortfolioGenerateResumeConfig(JobBuilderFactory jobBuilderFactory, StepBuilderFactory stepBuilderFactory) {
        this.jobBuilderFactory = jobBuilderFactory;
        this.stepBuilderFactory = stepBuilderFactory;
    }

    @Bean
    public Job portfolioGenerateResume(@Named("generateResumeEntityStep") Step generateResumeEntityStep, BatchJobEventListenerImpl listener) {
        return jobBuilderFactory.get("portfolioGenerateResume")
                .start(generateResumeEntityStep)
                .listener(listener)
                .build();
    }

    @Bean
    public Step generateResumeEntityStep(ItemReader<Resume> resumeXMLReader, ItemProcessor<Resume, String> resumeFTLProcessor, ItemWriter<String> resumePDFWriter, BatchJobEventListenerImpl<Resume, String> listener) {
        return stepBuilderFactory.get("generateResumeEntityStep")
                .<Resume, String>chunk(1)
                .reader(resumeXMLReader)
                .processor(resumeFTLProcessor)
                .writer(resumePDFWriter)
                .listener((ItemReadListener<? super Resume>) listener)
                .listener((ItemReadListener<? super Resume>) listener)
                .listener((ItemReadListener<? super Resume>) listener)
                .allowStartIfComplete(true)
                .build();
    }
}

