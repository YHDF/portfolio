package fr.yha.portfolio.config.cache;

import net.sf.ehcache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.ehcache.EhCacheCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Objects;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public net.sf.ehcache.CacheManager ehCacheManager() {
        CacheManager cacheManager = CacheManager.newInstance(
                Objects.requireNonNull(CacheConfig.class.getResource("/ehcache.xml")));
        return cacheManager;
    }

    @Bean
    public EhCacheCacheManager cacheManager() {
        return new EhCacheCacheManager(ehCacheManager());
    }
}
