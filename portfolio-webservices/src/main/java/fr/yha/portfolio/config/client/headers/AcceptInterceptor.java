package fr.yha.portfolio.config.client.headers;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

@Component
@PropertySource("classpath:vault.properties")
public class AcceptInterceptor implements RequestInterceptor {
    private String accept;

    public AcceptInterceptor(@Value("${github.api.accept}") String accept) {
        this.accept = accept;
    }

    @Override
    public void apply(RequestTemplate template) {
        template.headers().remove("Accept");
        template.header("Accept", accept);
    }
}
