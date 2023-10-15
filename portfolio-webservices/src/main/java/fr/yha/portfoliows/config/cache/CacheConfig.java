package fr.yha.portfoliows.config.cache;

import net.sf.ehcache.CacheManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.ehcache.EhCacheCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Objects;

@Configuration
@EnableCaching
public class CacheConfig {

    private static final Logger LOGGER = LoggerFactory.getLogger(CacheConfig.class);

    @Bean
    public net.sf.ehcache.CacheManager ehCacheManager() {
        LOGGER.info("Initializing EhCache Manager...");
        try {
            CacheManager cacheManager = CacheManager.newInstance(
                    Objects.requireNonNull(CacheConfig.class.getResource("/ehcache.xml")));
            LOGGER.info("EhCache Manager initialized successfully.");
            return cacheManager;
        } catch (Exception e) {
            LOGGER.error("Error initializing EhCache Manager: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Bean
    public EhCacheCacheManager cacheManager() {
        LOGGER.info("Initializing Spring's EhCache Cache Manager...");
        try {
            EhCacheCacheManager ehCacheCacheManager = new EhCacheCacheManager(ehCacheManager());
            LOGGER.info("Spring's EhCache Cache Manager initialized successfully.");
            return ehCacheCacheManager;
        } catch (Exception e) {
            LOGGER.error("Error initializing Spring's EhCache Cache Manager: {}", e.getMessage(), e);
            throw e;
        }
    }
}

