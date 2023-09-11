package fr.yha.portfolio.data.dto;

import java.io.Serial;
import java.io.Serializable;

public class Owner implements Serializable {
    @Serial
    private static final long serialVersionUID = 5641792198579283032L;
    public String login;
    public int id;
    public String node_id;
    public String avatar_url;
    public String gravatar_id;
    public String url;
    public String html_url;
    public String followers_url;
    public String following_url;
    public String gists_url;
    public String starred_url;
    public String subscriptions_url;
    public String organizations_url;
    public String repos_url;
    public String events_url;
    public String received_events_url;
    public String type;
    public boolean site_admin;
}