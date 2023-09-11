package fr.yha.portfolio.config.filter;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import java.io.IOException;

@Component
public class PortfolioClientFilter implements Filter {

    Logger logger = LoggerFactory.getLogger(PortfolioClientFilter.class);

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        logger.trace("Démarrage du {}", PortfolioClientFilter.class.getSimpleName());

    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        logger.info("Requête passée par le filter");
        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
        logger.trace("Arrêt du {}", PortfolioClientFilter.class.getSimpleName());
    }
}
