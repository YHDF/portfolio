package fr.yha.portfolio.webservices.controller;


import com.fasterxml.jackson.core.JsonProcessingException;
import fr.yha.portfolio.data.dto.RepositoryDTO;
import fr.yha.portfolio.services.GithubApiService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "/projects")
public class ProjectController {

    private static final Logger LOGGER = LoggerFactory.getLogger(ProjectController.class);

    private final GithubApiService githubApiService;

    public ProjectController(GithubApiService githubApiService){
        this.githubApiService = githubApiService;
    }

    @GetMapping("/health")
    public String checkGithubStatus() {
        LOGGER.info("Received request to check GitHub status.");
        try {
            String status = this.githubApiService.checkOctocat();
            LOGGER.info("GitHub status: {}", status);
            return status;
        } catch (Exception e) {
            LOGGER.error("Error checking GitHub status: {}", e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/repositories")
    public List<RepositoryDTO> getGithubRepositories() throws JsonProcessingException {
        LOGGER.info("Received request to get GitHub repositories.");
        try {
            List<RepositoryDTO> repos = this.githubApiService.getRepos();
            LOGGER.info("Successfully retrieved {} GitHub repositories.", repos.size());
            return repos;
        } catch (JsonProcessingException e) {
            LOGGER.error("Error processing JSON while retrieving GitHub repositories: {}", e.getMessage(), e);
            throw e;
        } catch (Exception e) {
            LOGGER.error("Error retrieving GitHub repositories: {}", e.getMessage(), e);
            throw e;
        }
    }
}
