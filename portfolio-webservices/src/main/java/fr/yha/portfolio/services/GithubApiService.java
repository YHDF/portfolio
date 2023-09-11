package fr.yha.portfolio.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import fr.yha.portfolio.data.dto.RepositoryDTO;
import fr.yha.portfolio.data.entities.enums.Keywords;
import fr.yha.portfolio.webservices.clients.GithubApiClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GithubApiService {
    private final GithubApiClient githubApiClient;
    private final ObjectMapper objectMapper;

    @Autowired
    public GithubApiService(GithubApiClient githubApiClient, ObjectMapper objectMapper){
        this.githubApiClient = githubApiClient;
        this.objectMapper = objectMapper;
    }

    public String checkOctocat(){
        return this.githubApiClient.getOctocat();
    }

    //@Cacheable("github-repositories")
    public List<RepositoryDTO> getRepos() throws JsonProcessingException {
        /*TODO externalize the login variable*/
        String jsonString = this.githubApiClient.getRepositories("");
        List<RepositoryDTO> repositories = Arrays.asList(objectMapper.readValue(jsonString, RepositoryDTO[].class));
        repositories = repositories.stream().filter(repositoryDTO -> {
            boolean condition = false;
            for (Keywords keyword : Keywords.values()) {
                if(keyword.getOwner().equalsIgnoreCase(repositoryDTO.getOwner().login) && keyword.getRepositoryName().equalsIgnoreCase(repositoryDTO.getName())){
                    condition = true;
                    break;
                }
            }
            return condition;
        }).collect(Collectors.toList());
        return repositories;
    }


}
