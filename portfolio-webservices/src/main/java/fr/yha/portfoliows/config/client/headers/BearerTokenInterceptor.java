package fr.yha.portfoliows.config.client.headers;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class BearerTokenInterceptor implements RequestInterceptor {

    private final String token;

    public BearerTokenInterceptor(@Value("${github.api.token}") String token) {
        this.token = token;
    }

    @Override
    public void apply(RequestTemplate template) {
        template.headers().remove("Authorization");
        template.header("Authorization", "Bearer " + token);
    }
}
