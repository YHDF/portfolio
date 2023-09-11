package fr.yha.portfolio.webservices.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/starter")
public class StarterController {
    @GetMapping()
    public String starterDefaultRoute() {
        return StarterController.class.getSimpleName();
    }
}
