package fr.yha.portfolio.config.clients;


import feign.Client;
import feign.Contract;
import feign.Feign;
import feign.Logger;
import feign.codec.Decoder;
import feign.codec.Encoder;
import feign.slf4j.Slf4jLogger;
import fr.yha.portfolio.config.clients.headers.AcceptInterceptor;
import fr.yha.portfolio.config.clients.headers.BearerTokenInterceptor;
import fr.yha.portfolio.config.clients.headers.VersionInterceptor;
import fr.yha.portfolio.webservices.clients.GithubApiClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;


public class FeignClientConfig {
    @Autowired
    private BearerTokenInterceptor bearerTokenInterceptor;
    @Autowired
    private AcceptInterceptor acceptInterceptor;
    @Autowired
    private VersionInterceptor versionInterceptor;


    @Bean
    public Client feignClient() {
        return new Client.Default(null, null);
    }

    @Bean
    public Encoder feignEncoder() {
        return new Encoder.Default();
    }

    @Bean
    public Decoder feignDecoder() {
        return new Decoder.Default();
    }

    @Bean
    public Contract feignContract() {
        return new Contract.Default();
    }

    @Bean
    public Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;
    }

    @Bean
    public GithubApiClient githubApiRestClient(Client client, Encoder encoder, Decoder decoder, Contract contract){
        return this.createClient(GithubApiClient.class, client, encoder, decoder, contract);
    }

    public <U> U createClient(Class<U> targetInterface, Client client, Encoder encoder, Decoder decoder, Contract contract) {
        return Feign.builder()
                .client(client)
                .encoder(encoder)
                .decoder(decoder)
                .contract(contract)
                //.requestInterceptor(new BasicAuthRequestInterceptor("admin", "admin"))
                .requestInterceptor(bearerTokenInterceptor)
                .requestInterceptor(acceptInterceptor)
                .requestInterceptor(versionInterceptor)
                .logger(new Slf4jLogger(targetInterface))
                .logLevel(Logger.Level.FULL)
                .target(targetInterface, "https://api.github.com");
    }
}
