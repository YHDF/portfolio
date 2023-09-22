package fr.yha.portfoliobatch.helpers.processor;

import fr.yha.portfoliobatch.entity.Work;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class WorkItemProcessor implements ItemProcessor<Work, Work> {
    @Override
    public Work process(Work work) {
        if(work.getCreatedOn() == null){
            work.setCreatedOn(LocalDateTime.now());
        }
        work.setUpdatedOn(LocalDateTime.now());

        return work;
    }
}
