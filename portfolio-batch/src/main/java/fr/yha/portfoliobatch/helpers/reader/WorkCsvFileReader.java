package fr.yha.portfoliobatch.helpers.reader;

import fr.yha.portfoliocore.entity.Work;
import org.springframework.batch.item.ExecutionContext;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.file.FlatFileItemReader;
import org.springframework.batch.item.file.FlatFileParseException;
import org.springframework.batch.item.file.mapping.DefaultLineMapper;
import org.springframework.batch.item.file.transform.DelimitedLineTokenizer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Arrays;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


@Component
public class WorkCsvFileReader implements ItemReader<Work> {

    private final FlatFileItemReader<Work> workFlatFileItemReader;

    private final ResourcePatternResolver resourcePatternResolver;


    @Autowired
    public WorkCsvFileReader(ResourcePatternResolver resourcePatternResolver) {
        this.workFlatFileItemReader = new FlatFileItemReader<>();
        this.resourcePatternResolver = resourcePatternResolver;
    }


    public String getLatestVersionFileName() throws IOException {
        Resource[] resources = this.resourcePatternResolver.getResources("classpath:work-experience-raw/work_v-*.csv");

        return Arrays.stream(resources)
                .map(resource -> {
                    try {
                        return resource.getURL().toString();
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                })
                .sorted(this::compareVersions)
                .reduce((first, second) -> second)
                .orElseThrow(() -> new FileNotFoundException("CSV file not found"));
    }

    private int compareVersions(String o1, String o2) {
        String version1 = o1.replaceAll("[^0-9.]", "");
        String version2 = o2.replaceAll("[^0-9.]", "");
        return version1.compareTo(version2);
    }


    @PostConstruct
    public void init() throws IOException {
        // Set the resource (CSV file)
        String latestVersionFilePath = this.getLatestVersionFileName();
        Pattern pattern = Pattern.compile("work-experience-raw/work_v-([0-9]\\.){2}[0-9]\\.csv", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(latestVersionFilePath);
        if (matcher.find()) {
            this.workFlatFileItemReader.setResource(new ClassPathResource(matcher.group(0)));
        } else {
            throw new IllegalArgumentException("No valid file path found!");
        }
        // Set the Flat file reader name (Optional)
        this.workFlatFileItemReader.setName("work-csv-Reader");

        // Setup line mapper
        DefaultLineMapper<Work> lineMapper = new DefaultLineMapper<>();
        lineMapper.setLineTokenizer(new DelimitedLineTokenizer());
        lineMapper.setFieldSetMapper(new WorkFieldSetMapper());

        // Set the line mapper
        this.workFlatFileItemReader.setLineMapper(lineMapper);
        this.workFlatFileItemReader.open(new ExecutionContext());
    }

    @Override
    public Work read() throws Exception {
        try {
            return this.workFlatFileItemReader.read();
        } catch (FlatFileParseException ex) {
            System.err.println("Error parsing line: " + ex.getLineNumber());
            System.err.println("Input data: " + ex.getInput());
            throw ex;
        }

    }
}

