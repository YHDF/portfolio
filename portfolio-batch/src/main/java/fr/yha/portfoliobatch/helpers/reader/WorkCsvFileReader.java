package fr.yha.portfoliobatch.helpers.reader;

import fr.yha.portfoliobatch.entity.Work;
import org.springframework.batch.item.ExecutionContext;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.file.FlatFileItemReader;
import org.springframework.batch.item.file.FlatFileParseException;
import org.springframework.batch.item.file.mapping.DefaultLineMapper;
import org.springframework.batch.item.file.transform.DelimitedLineTokenizer;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;


@Component
public class WorkCsvFileReader implements ItemReader<Work> {

    private final FlatFileItemReader<Work> workFlatFileItemReader;

    public WorkCsvFileReader() {
        this.workFlatFileItemReader = new FlatFileItemReader<>();
    }

    @PostConstruct
    public void init() {
        // Set the resource (CSV file)
        this.workFlatFileItemReader.setResource(new ClassPathResource("work-experience-raw/work_v-0.0.1.csv"));
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

