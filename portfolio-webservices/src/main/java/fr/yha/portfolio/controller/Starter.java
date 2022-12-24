package fr.yha.portfolio.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/index")
public class Starter {
    @GetMapping()
    public String home() {
        return "hello index";
    }
}
