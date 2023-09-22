package fr.yha.portfoliobatch.helpers.writer;

import fr.yha.portfoliobatch.entity.Work;
import fr.yha.portfoliobatch.repositories.WorkRepository;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class WorkItemWriter implements ItemWriter<Work> {

    private final WorkRepository workRepository;

    @Autowired
    public WorkItemWriter(WorkRepository workRepository) {
        this.workRepository = workRepository;
    }

    @Override
    @Transactional
    public void write(List<? extends Work> list) {
        try {
            List<Work> workList = list.stream().map(this.workRepository::saveAndFlush).collect(Collectors.toList());
            System.out.println(workList.get(0));
        } catch(Exception e) {
            e.printStackTrace();
        }
    }
}
