package fr.yha.portfoliows.config.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
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
            if(request instanceof HttpServletRequest) {
                HttpServletRequest httpRequest = (HttpServletRequest) request;
                LOGGER.info("HTTP Request: {} {}", httpRequest.getMethod(), httpRequest.getRequestURI());
            } else {
                LOGGER.info("Request received at filter. Details: [{}]", request.toString());
            }

            chain.doFilter(request, response);

            if(response instanceof HttpServletResponse) {
                HttpServletResponse httpResponse = (HttpServletResponse) response;
                LOGGER.info("HTTP Response: Status {}", httpResponse.getStatus());
            } else {
                LOGGER.info("Response processed at filter. Details: [{}]", response.toString());
            }
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
