package com.voluntariado.repository;

import com.voluntariado.entity.Canje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CanjeRepository extends JpaRepository<Canje, Long> {
}
