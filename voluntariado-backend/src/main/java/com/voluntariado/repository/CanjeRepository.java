package com.voluntariado.repository;

import com.voluntariado.entity.Canje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CanjeRepository extends JpaRepository<Canje, Long> {
    List<Canje> findByUsuarioId(Long usuarioId);
}
