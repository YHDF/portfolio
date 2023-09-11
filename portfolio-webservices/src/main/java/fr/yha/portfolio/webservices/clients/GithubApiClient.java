package fr.yha.portfolio.webservices.clients;

import feign.Param;
import feign.RequestLine;

public interface GithubApiClient {

    @RequestLine("GET /octocat")
    String getOctocat();

    @RequestLine("GET /users/{login}/repos")
    String getRepositories(@Param("login") String login);
}
