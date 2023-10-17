package fr.yha.portfoliows.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;


@Configuration
public class TaskExecutorConfig {

    @Bean
    public ThreadPoolTaskExecutor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);  // Initial pool size
        executor.setMaxPoolSize(10);  // Max pool size
        executor.setQueueCapacity(25); // Queue capacity
        executor.setThreadNamePrefix("MyThread-"); // Thread naming
        executor.setKeepAliveSeconds(60); // Keep alive time for threads beyond core pool size
        executor.initialize();
        return executor;
    }
}
