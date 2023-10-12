package fr.yha.portfoliobatch.initdata.helpers.writer;

import fr.yha.portfoliocore.entity.Work;
import fr.yha.portfoliocore.repositories.WorkRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class WorkItemWriter implements ItemWriter<Work> {

    private static final Logger LOGGER = LoggerFactory.getLogger(WorkItemWriter.class);

    private final WorkRepository workRepository;

    @Autowired
    public WorkItemWriter(WorkRepository workRepository) {
        this.workRepository = workRepository;
    }

    @Override
    @Transactional
    public void write(List<? extends Work> list) {
        try {
            LOGGER.info("Starting write operation for list of size: {}", list.size());
            List<Work> workList = list.stream().map(this.workRepository::saveAndFlush).collect(Collectors.toList());
            LOGGER.info("Write operation successful. First element: {}", workList.get(0));
        } catch(Exception e) {
            LOGGER.error("Error during write operation: {}", e.getMessage(), e);
        }
    }

}
