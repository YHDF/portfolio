package fr.yha.portfoliobatch.initdata.helpers.processor;

import fr.yha.portfoliobatch.initdata.dto.WorkDTO;
import fr.yha.portfoliocore.entity.Work;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class WorkItemProcessor implements ItemProcessor<WorkDTO, Work> {

    private final static Logger LOGGER = LoggerFactory.getLogger(WorkItemProcessor.class);
    @Override
    public Work process(WorkDTO workDTO) {
        LOGGER.info("Processing and mapping Work entity to workDTO.");

        Work work = new Work();
        work.setPeriod(workDTO.getPeriod());
        work.setTitle(workDTO.getTitle());
        work.setDescription(workDTO.getDescription());
        work.setTasks(workDTO.getTasks());
        work.setLanguageVersion(workDTO.getLanguageVersion());
        if(work.getCreatedOn() == null){
            work.setCreatedOn(LocalDateTime.now());
        }
        work.setUpdatedOn(LocalDateTime.now());

        return work;
    }
}
