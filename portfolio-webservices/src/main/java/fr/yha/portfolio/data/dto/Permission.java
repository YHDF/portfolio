package fr.yha.portfolio.data.dto;

import java.io.Serial;
import java.io.Serializable;

public class Permission implements Serializable {
    @Serial
    private static final long serialVersionUID = 5821915983683910633L;
    public boolean admin;
    public boolean maintain;
    public boolean push;
    public boolean triage;
    public boolean pull;
}