package fr.yha.portfoliobatch.helpers.reader;

import fr.yha.portfoliobatch.entity.Work;
import org.springframework.batch.item.file.mapping.FieldSetMapper;
import org.springframework.batch.item.file.transform.FieldSet;
import org.springframework.stereotype.Component;

@Component
public class WorkFieldSetMapper implements FieldSetMapper<Work> {
    public Work mapFieldSet(FieldSet fieldSet) {
        Work work = new Work();

        work.setPeriod(fieldSet.readString(0));
        work.setTitle(fieldSet.readString(1));
        work.setDescription(fieldSet.readString(2));
        work.setTasks(fieldSet.readString(3));

        return work;
    }
}
