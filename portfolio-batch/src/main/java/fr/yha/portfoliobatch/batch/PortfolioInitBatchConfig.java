package fr.yha.portfoliobatch.batch;


import fr.yha.portfoliocore.entity.Work;
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
public class PortfolioInitBatchConfig {

    private final JobBuilderFactory jobBuilderFactory;
    private final StepBuilderFactory stepBuilderFactory;

    @Autowired
    public PortfolioInitBatchConfig(JobBuilderFactory jobBuilderFactory, StepBuilderFactory stepBuilderFactory) {
        this.jobBuilderFactory = jobBuilderFactory;
        this.stepBuilderFactory = stepBuilderFactory;
    }

    @Bean
    public Job portfolioInitData(@Named("initWorkEntityStep") Step initWorkEntityStep) {
        return jobBuilderFactory.get("portfolioInitData")
                .start(initWorkEntityStep)
                .build();
    }

    @Bean
    public Step initWorkEntityStep(ItemReader<Work> workCsvFileReader, ItemWriter<Work> workItemWriter, ItemProcessor<Work, Work> workItemProcessor) {
        return stepBuilderFactory.get("populateTableStep")
                .<Work, Work>chunk(1)
                .reader(workCsvFileReader)
                .processor(workItemProcessor)
                .writer(workItemWriter)
                .allowStartIfComplete(true)
                .build();
    }
}

