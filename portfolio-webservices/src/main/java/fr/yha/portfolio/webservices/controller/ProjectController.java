package fr.yha.portfolio.webservices.controller;


import com.fasterxml.jackson.core.JsonProcessingException;
import fr.yha.portfolio.data.dto.RepositoryDTO;
import fr.yha.portfolio.services.GithubApiService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "/projects")
public class ProjectController {
    private final GithubApiService githubApiService;

    public ProjectController(GithubApiService githubApiService){
        this.githubApiService = githubApiService;
    }
    @GetMapping("/health")
    public String checkGithubStatus() {
        return this.githubApiService.checkOctocat();
    }

    @GetMapping("/repositories")
    public List<RepositoryDTO> getGithubRepositories() throws JsonProcessingException {
        return this.githubApiService.getRepos();
    }
}
