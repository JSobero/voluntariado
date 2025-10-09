package com.voluntariado.service;

import com.voluntariado.entity.Inscripcion;
import com.voluntariado.repository.InscripcionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InscripcionService {

    private final InscripcionRepository inscripcionRepository;

    public InscripcionService(InscripcionRepository inscripcionRepository) {
        this.inscripcionRepository = inscripcionRepository;
    }

    public List<Inscripcion> listarInscripciones() {
        return inscripcionRepository.findAll();
    }

    public Optional<Inscripcion> obtenerPorId(Long id) {
        return inscripcionRepository.findById(id);
    }

    public Inscripcion guardarInscripcion(Inscripcion inscripcion) {
        return inscripcionRepository.save(inscripcion);
    }

    public Inscripcion actualizarInscripcion(Long id, Inscripcion inscripcion) {
        return inscripcionRepository.findById(id).map(i -> {
            i.setEstado(inscripcion.getEstado());
            return inscripcionRepository.save(i);
        }).orElseThrow(() -> new RuntimeException("Inscripción no encontrada"));
    }

    public void eliminarInscripcion(Long id) {
        inscripcionRepository.deleteById(id);
    }

    public List<Inscripcion> listarPorUsuario(Long usuarioId) {
        return inscripcionRepository.findByUsuarioId(usuarioId);
    }

    public List<Inscripcion> listarPorEvento(Long eventoId) {
        return inscripcionRepository.findByEventoId(eventoId);
    }
}
