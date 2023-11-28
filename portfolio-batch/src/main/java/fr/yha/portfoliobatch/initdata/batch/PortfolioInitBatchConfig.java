package fr.yha.portfoliobatch.initdata.batch;


import fr.yha.portfoliobatch.initdata.dto.WorkDTO;
import fr.yha.portfoliobatch.initdata.helpers.reader.WorkCsvFileReader;
import fr.yha.portfoliocore.entity.Work;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.support.ResourcePatternResolver;

import javax.inject.Named;

@Configuration
public class PortfolioInitBatchConfig {

    private final JobBuilderFactory jobBuilderFactory;
    private final StepBuilderFactory stepBuilderFactory;

    public final static String ENGLISH_VERSION = "US-en";
    public final static String FRENCH_VERSION = "FR-fr";

    @Autowired
    public PortfolioInitBatchConfig(JobBuilderFactory jobBuilderFactory, StepBuilderFactory stepBuilderFactory) {
        this.jobBuilderFactory = jobBuilderFactory;
        this.stepBuilderFactory = stepBuilderFactory;
    }

    @Bean
    public Job portfolioInitData(@Named("initWorkEntityStepEnglish") Step initWorkEntityStepEnglish,
                                 @Named("initWorkEntityStepFrench") Step initWorkEntityStepFrench) {
        return jobBuilderFactory.get("portfolioInitData")
                .start(initWorkEntityStepEnglish)
                .on("COMPLETED").to(initWorkEntityStepFrench)
                .end()
                .build();
    }

    @Bean
    public Step initWorkEntityStepEnglish(
            ItemReader<WorkDTO> englishWorkCsvFileReader,
            ItemProcessor<WorkDTO, Work> workItemProcessor,
            ItemWriter<Work> workItemWriter) {
        return stepBuilderFactory.get("populateTableStep")
                .<WorkDTO, Work>chunk(1)
                .reader(englishWorkCsvFileReader)
                .processor(workItemProcessor)
                .writer(workItemWriter)
                .allowStartIfComplete(true)
                .build();
    }

    @Bean
    public Step initWorkEntityStepFrench(
            ItemReader<WorkDTO> frenchWorkCsvFileReader,
            ItemProcessor<WorkDTO, Work> workItemProcessor,
            ItemWriter<Work> workItemWriter) {
        return stepBuilderFactory.get("populateTableStep")
                .<WorkDTO, Work>chunk(1)
                .reader(frenchWorkCsvFileReader)
                .processor(workItemProcessor)
                .writer(workItemWriter)
                .allowStartIfComplete(true)
                .build();
    }

    @Bean
    @StepScope
    public ItemReader<WorkDTO> englishWorkCsvFileReader(
            ResourcePatternResolver resourcePatternResolver) {
        return new WorkCsvFileReader(resourcePatternResolver, ENGLISH_VERSION);
    }


    @Bean
    @StepScope
    public ItemReader<WorkDTO> frenchWorkCsvFileReader(
            ResourcePatternResolver resourcePatternResolver) {
        return new WorkCsvFileReader(resourcePatternResolver, FRENCH_VERSION);
    }
}

