package fr.yha.portfolio.data.entities.enums;

public enum Keywords {
    PWS("PWS", "YHDF"), LBP("LBP", "YHDF"),
    SHELL("SHELL", "YHDF"), CINESENSOR("CINESENSOR", "mkhalouk"),
    SIMPLE_WEATHER("SIMPLE-WEATHER", "mkhalouk"),
    CALENDARIO("CALENDARIO", "YHDF"), SITE_LUTEXIA("SITE-LUTEXIA", "YHDF");


    private final String repositoryName;
    private final String owner;

    Keywords(String repositoryName, String owner) {
        this.repositoryName = repositoryName;
        this.owner = owner;
    }

    public String getRepositoryName() {
        return repositoryName;
    }

    public String getOwner() {
        return owner;
    }
}
