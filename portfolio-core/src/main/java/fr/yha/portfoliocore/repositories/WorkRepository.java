package fr.yha.portfoliocore.repositories;


import fr.yha.portfoliocore.entity.Work;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkRepository extends JpaRepository<Work, Long> {}
