package fr.yha.portfoliocore.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.core.*;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

import java.util.List;

@Service
public class BatchJobEventListenerImpl<T, S> implements ItemReadListener<T>, ItemProcessListener<T, S>, ItemWriteListener<T>, JobExecutionListener {

    private static final Logger LOGGER = LoggerFactory.getLogger(BatchJobEventListenerImpl.class);
    private final Sinks.Many<String> sink;
    private final Flux<String> flux;

    public BatchJobEventListenerImpl() {
        sink = Sinks.many().multicast().onBackpressureBuffer();
        flux = sink.asFlux().share();
    }

    public Sinks.Many<String> getSink() {
        return sink;
    }

    public Flux<String> getFlux() {
        return flux;
    }

    @Override
    public void beforeRead() {
        String message = "Initiating read operation. Attempting to read XML data to gather the resume information...";
        LOGGER.info(message);
        sink.tryEmitNext(message);
        this.pauseExecution();
    }

    @Override
    public void afterRead(T item) {
        String message = "Data read successfully. Processing the read item...";
        LOGGER.info(message);
        sink.tryEmitNext(message);
        this.pauseExecution();
    }

    @Override
    public void onReadError(Exception e) {
        String message = "Error encountered during reading. Exception: " + e.getMessage();
        LOGGER.error(message, e);
        sink.tryEmitNext(message);
    }

    @Override
    public void beforeProcess(T item) {
        String message = "Processing the resume information. Applying template and style...";
        LOGGER.info(message);
        sink.tryEmitNext(message);
        this.pauseExecution();
    }

    @Override
    public void afterProcess(T item, S result) {
        String message = "Processing complete. Moving on to the writing phase...";
        LOGGER.info(message);
        sink.tryEmitNext(message);
        this.pauseExecution();
    }

    @Override
    public void onProcessError(T item, Exception e) {
        String message = "Error processing item: " + item + ". Exception: " + e.getMessage();
        LOGGER.error(message, e);
        sink.tryEmitNext(message);

    }

    @Override
    public void beforeWrite(List<? extends T> items) {
        String message = "Starting writing process. Translating the template into a PDF document...";
        LOGGER.info(message);
        sink.tryEmitNext(message);
        this.pauseExecution();
    }

    @Override
    public void afterWrite(List<? extends T> items) {
        String message = "PDF document creation successful. Preparing for renaming and downloading...";
        LOGGER.info(message);
        sink.tryEmitNext(message);
        this.pauseExecution();
    }

    @Override
    public void onWriteError(Exception e, List<? extends T> items) {
        String message = "Error encountered during writing items: " + items + ". Exception: " + e.getMessage();
        LOGGER.error(message, e);
        sink.tryEmitNext(message);
    }


    public void pauseExecution(){
        try {
            Thread.sleep(500L);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void beforeJob(JobExecution jobExecution) {

    }

    @Override
    public void afterJob(JobExecution jobExecution) {
        String message = "NOP!";
        LOGGER.info(message);
        sink.tryEmitNext(message);
    }
}
