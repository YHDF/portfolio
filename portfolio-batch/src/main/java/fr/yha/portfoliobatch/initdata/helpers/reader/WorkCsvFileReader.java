package fr.yha.portfoliobatch.initdata.helpers.reader;

import fr.yha.portfoliobatch.initdata.dto.WorkDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.item.ExecutionContext;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.file.FlatFileItemReader;
import org.springframework.batch.item.file.FlatFileParseException;
import org.springframework.batch.item.file.mapping.DefaultLineMapper;
import org.springframework.batch.item.file.transform.DelimitedLineTokenizer;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.ResourcePatternResolver;

import javax.annotation.PostConstruct;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Arrays;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


public class WorkCsvFileReader implements ItemReader<WorkDTO> {

    private static final Logger LOGGER = LoggerFactory.getLogger(WorkCsvFileReader.class);
    private final FlatFileItemReader<WorkDTO> workFlatFileItemReader;

    private final ResourcePatternResolver resourcePatternResolver;

    private final DefaultLineMapper<WorkDTO> lineMapper = new DefaultLineMapper<>();

    private final String languageVersion;


    public WorkCsvFileReader(ResourcePatternResolver resourcePatternResolver, String languageVersion) {
        this.workFlatFileItemReader = new FlatFileItemReader<>();
        this.resourcePatternResolver = resourcePatternResolver;
        this.languageVersion = languageVersion;
    }


    public String getLatestVersionFileName() throws IOException {
        Resource[] resources = this.resourcePatternResolver.getResources(String.format("classpath:work-experience-raw/%s/work_v-*.csv", this.languageVersion));
        LOGGER.info("Found {} resources to process", resources.length);

        return Arrays.stream(resources)
                .map(resource -> {
                    try {
                        return resource.getURL().toString();
                    } catch (IOException e) {
                        LOGGER.error("Error getting URL from resource", e);
                        throw new RuntimeException(e);
                    }
                })
                .sorted(this::compareVersions)
                .reduce((first, second) -> second)
                .orElseThrow(() -> {
                    LOGGER.error("CSV file not found");
                    return new FileNotFoundException("CSV file not found");
                });
    }

    private int compareVersions(String o1, String o2) {
        String version1 = o1.replaceAll("[^0-9.]", "");
        String version2 = o2.replaceAll("[^0-9.]", "");
        return version1.compareTo(version2);
    }


    @PostConstruct
    public void init() throws IOException {
        LOGGER.info("Initializing...");

        // Set the resource (CSV file)
        String latestVersionFilePath = this.getLatestVersionFileName();
        Pattern pattern = Pattern.compile(String.format("work-experience-raw/%s/work_v-([0-9]\\.){2}[0-9]\\.csv", this.languageVersion), Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(latestVersionFilePath);
        if (matcher.find()) {
            LOGGER.info("Setting resource to {}", matcher.group(0));
            this.workFlatFileItemReader.setResource(new ClassPathResource(matcher.group(0)));
        } else {
            LOGGER.error("No valid file path found!");
            throw new IllegalArgumentException("No valid file path found!");
        }

        // Set the Flat file reader name (Optional)
        this.workFlatFileItemReader.setName("work-csv-Reader");
        LOGGER.info("Flat file reader name set to 'work-csv-Reader'");

        // Setup line mapper and set it
        setupLineMapper();
        LOGGER.info("Line Mapper setup complete");

        this.workFlatFileItemReader.open(new ExecutionContext());
        LOGGER.info("Initialization complete");
    }

    private void setupLineMapper() {
        this.lineMapper.setFieldSetMapper(new WorkFieldSetMapper(this.languageVersion));
        this.lineMapper.setLineTokenizer(new DelimitedLineTokenizer());

        // Set the line mapper
        this.workFlatFileItemReader.setLineMapper(lineMapper);
    }

    @Override
    public WorkDTO read() throws Exception {
        try {
            return this.workFlatFileItemReader.read();
        } catch (FlatFileParseException ex) {
            LOGGER.error("Error parsing line: {}. Input data: {}", ex.getLineNumber(), ex.getInput(), ex);
            throw ex;
        }
    }

}

