package fr.yha.portfolio.config.clients.headers;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

@Component
@PropertySource("classpath:vault.properties")
public class VersionInterceptor implements RequestInterceptor {
    private String version;

    public VersionInterceptor(@Value("${github.api.version}") String version) {
        this.version = version;
    }

    @Override
    public void apply(RequestTemplate template) {
        template.headers().remove("X-GitHub-Api-Version");
        template.header("X-GitHub-Api-Version",  version);
    }
}