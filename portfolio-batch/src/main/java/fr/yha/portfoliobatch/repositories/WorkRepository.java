package fr.yha.portfoliobatch.repositories;

import fr.yha.portfoliobatch.entity.Work;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkRepository extends JpaRepository<Work, Long> {}
