package fr.yha.portfoliows.config.client.headers;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class AcceptInterceptor implements RequestInterceptor {
    private final String accept;

    public AcceptInterceptor(@Value("${github.api.accept}") String accept) {
        this.accept = accept;
    }

    @Override
    public void apply(RequestTemplate template) {
        template.headers().remove("Accept");
        template.header("Accept", accept);
    }
}
