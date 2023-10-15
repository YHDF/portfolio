package fr.yha.portfoliows.config.client;


import feign.Client;
import feign.Contract;
import feign.Feign;
import feign.Logger;
import feign.codec.Decoder;
import feign.codec.Encoder;
import feign.slf4j.Slf4jLogger;
import fr.yha.portfoliows.config.client.headers.AcceptInterceptor;
import fr.yha.portfoliows.config.client.headers.BearerTokenInterceptor;
import fr.yha.portfoliows.config.client.headers.VersionInterceptor;
import fr.yha.portfoliows.webservices.clients.GithubApiClient;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;


public class FeignClientConfig {
    private static final org.slf4j.Logger LOGGER = LoggerFactory.getLogger(FeignClientConfig.class);

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
        LOGGER.info("Creating GithubApiClient Bean");
        try {
            GithubApiClient clientInstance = this.createClient(GithubApiClient.class, client, encoder, decoder, contract);
            LOGGER.info("GithubApiClient Bean created successfully");
            return clientInstance;
        } catch (Exception e) {
            LOGGER.error("Error creating GithubApiClient Bean: {}", e.getMessage(), e);
            throw e;
        }
    }

    public <U> U createClient(Class<U> targetInterface, Client client, Encoder encoder, Decoder decoder, Contract contract) {
        LOGGER.info("Initializing client for interface: {}", targetInterface.getName());
        try {
            U clientInstance = Feign.builder()
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

            LOGGER.info("Client for interface {} initialized successfully", targetInterface.getName());
            return clientInstance;
        } catch (Exception e) {
            LOGGER.error("Error initializing client for interface {}: {}", targetInterface.getName(), e.getMessage(), e);
            throw e;
        }
    }

}
