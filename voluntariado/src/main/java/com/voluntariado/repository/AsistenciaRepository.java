package com.voluntariado.repository;

import com.voluntariado.entity.Asistencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AsistenciaRepository extends JpaRepository<Asistencia, Long> {
    List<Asistencia> findByEventoId(Long eventoId);
    Optional<Asistencia> findByUsuarioIdAndEventoId(Long usuarioId, Long eventoId);
}
