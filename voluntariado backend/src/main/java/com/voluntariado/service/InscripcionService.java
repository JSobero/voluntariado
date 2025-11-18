package com.voluntariado.service;

import com.voluntariado.dto.InscripcionRequestDTO; // <-- NUEVO
import com.voluntariado.entity.Evento;             // <-- NUEVO
import com.voluntariado.entity.Inscripcion;
import com.voluntariado.entity.Usuario;             // <-- NUEVO
import com.voluntariado.enums.EstadoInscripcion;    // <-- NUEVO
import com.voluntariado.repository.EventoRepository;  // <-- NUEVO
import com.voluntariado.repository.InscripcionRepository;
import com.voluntariado.repository.UsuarioRepository; // <-- NUEVO
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InscripcionService {

    private final InscripcionRepository inscripcionRepository;
    private final UsuarioRepository usuarioRepository;
    private final EventoRepository eventoRepository;

    public InscripcionService(InscripcionRepository inscripcionRepository,
                              UsuarioRepository usuarioRepository,
                              EventoRepository eventoRepository) {
        this.inscripcionRepository = inscripcionRepository;
        this.usuarioRepository = usuarioRepository;
        this.eventoRepository = eventoRepository;
    }

    public Inscripcion guardarInscripcion(InscripcionRequestDTO request) {
        Long usuarioId = request.getUsuarioId();
        Long eventoId = request.getEventoId();

        if (inscripcionRepository.existsByUsuarioIdAndEventoId(usuarioId, eventoId)) {
            throw new RuntimeException("El usuario ya está inscrito en este evento.");
        }

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Evento evento = eventoRepository.findById(eventoId)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado"));

        long inscritos = inscripcionRepository.countByEventoId(eventoId);
        if (evento.getCupoMaximo() != null && evento.getCupoMaximo() > 0 && inscritos >= evento.getCupoMaximo()) {
            throw new RuntimeException("El evento ya ha alcanzado su cupo máximo.");
        }

        Inscripcion nuevaInscripcion = new Inscripcion();
        nuevaInscripcion.setUsuario(usuario);
        nuevaInscripcion.setEvento(evento);
        nuevaInscripcion.setEstado(EstadoInscripcion.PENDIENTE);

        return inscripcionRepository.save(nuevaInscripcion);
    }


    public List<Inscripcion> listarInscripciones() {
        return inscripcionRepository.findAll();
    }

    public Optional<Inscripcion> obtenerPorId(Long id) {
        return inscripcionRepository.findById(id);
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