package fr.yha.portfolio.config.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import java.io.IOException;

@Component
public class PortfolioClientFilter implements Filter {

    private static final Logger LOGGER = LoggerFactory.getLogger(PortfolioClientFilter.class);

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        LOGGER.trace("Starting filter: {}", PortfolioClientFilter.class.getSimpleName());
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        try {
            LOGGER.info("Request received at filter. Details: [{}]", request.toString()); // Modify this to log actual request details you need
            chain.doFilter(request, response);
            LOGGER.info("Response processed at filter. Details: [{}]", response.toString()); // Modify this to log actual response details you need
        } catch (IOException | ServletException e) {
            LOGGER.error("Error processing request at filter: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    public void destroy() {
        LOGGER.trace("Stopping filter: {}", PortfolioClientFilter.class.getSimpleName());
    }
}
