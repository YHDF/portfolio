package fr.yha.portfoliobatch.initdata.helpers.reader;

import fr.yha.portfoliobatch.initdata.dto.WorkDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.item.file.mapping.FieldSetMapper;
import org.springframework.batch.item.file.transform.FieldSet;
import org.springframework.stereotype.Component;

@Component
public class WorkFieldSetMapper implements FieldSetMapper<WorkDTO> {

    private final static Logger LOGGER = LoggerFactory.getLogger(WorkFieldSetMapper.class);

    public WorkDTO mapFieldSet(FieldSet fieldSet) {
        LOGGER.info("Processing and mapping FieldSet to workDTO.");

        WorkDTO workDTO = new WorkDTO();

        workDTO.setPeriod(fieldSet.readString(0));
        workDTO.setTitle(fieldSet.readString(1));
        workDTO.setDescription(fieldSet.readString(2));
        workDTO.setTasks(fieldSet.readString(3));

        return workDTO;
    }
}
