package fr.yha.portfolio.config.client.headers;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

@Component
@PropertySource("classpath:vault.properties")
public class BearerTokenInterceptor implements RequestInterceptor {

    private String token;

    public BearerTokenInterceptor(@Value("${github.api.token}") String token) {
        this.token = token;
    }

    @Override
    public void apply(RequestTemplate template) {
        template.headers().remove("Authorization");
        template.header("Authorization", "Bearer " + token);
    }
}
