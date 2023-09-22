package fr.yha.portfoliobatch.config;

import org.springframework.batch.core.configuration.BatchConfigurationException;
import org.springframework.batch.core.configuration.annotation.DefaultBatchConfigurer;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.repository.support.JobRepositoryFactoryBean;
import org.springframework.batch.support.DatabaseType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;


//@Configuration
public class JobRepositoryConfig extends DefaultBatchConfigurer {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private PlatformTransactionManager transactionManager;

    @Override
    public JobRepository getJobRepository() {
        try {
            JobRepositoryFactoryBean factory = new JobRepositoryFactoryBean();
            factory.setDataSource(dataSource);
            factory.setTransactionManager(transactionManager);
            factory.setDatabaseType(DatabaseType.MYSQL.getProductName());
            //factory.setTablePrefix("PORTFOLIO.BATCH_");
            factory.setMaxVarCharLength(2500);
            factory.setIsolationLevelForCreate("ISOLATION_REPEATABLE_READ");
            factory.afterPropertiesSet();
            return factory.getObject();
        } catch (Exception e) {
            throw new BatchConfigurationException(e);
        }

    }

}
