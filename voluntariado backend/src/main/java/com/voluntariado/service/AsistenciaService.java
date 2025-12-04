package com.voluntariado.service;

import com.voluntariado.dto.AsistenciaRequestDTO;
import com.voluntariado.entity.*;
import com.voluntariado.enums.EstadoAsistencia;
import com.voluntariado.repository.AsistenciaRepository;
import com.voluntariado.repository.InscripcionRepository;
import com.voluntariado.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AsistenciaService {

    private final AsistenciaRepository asistenciaRepository;
    private final InscripcionRepository inscripcionRepository;
    private final UsuarioRepository usuarioRepository;

    public AsistenciaService(AsistenciaRepository asistenciaRepository,
                             InscripcionRepository inscripcionRepository,
                             UsuarioRepository usuarioRepository) {
        this.asistenciaRepository = asistenciaRepository;
        this.inscripcionRepository = inscripcionRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public Asistencia registrarAsistencia(AsistenciaRequestDTO request) {
        Inscripcion inscripcion = inscripcionRepository.findById(request.getInscripcionId())
                .orElseThrow(() -> new RuntimeException("Inscripción no encontrada"));

        Usuario usuario = inscripcion.getUsuario();
        Evento evento = inscripcion.getEvento();

        Optional<Asistencia> asistenciaExistente = asistenciaRepository
                .findByUsuarioIdAndEventoId(usuario.getId(), evento.getId());

        Asistencia asistencia;

        if (asistenciaExistente.isPresent()) {
            asistencia = asistenciaExistente.get();
            if (asistencia.getEstado() == EstadoAsistencia.CONFIRMADA && request.isAsistio()) {
                return asistencia;
            }
        } else {
            asistencia = new Asistencia();
            asistencia.setUsuario(usuario);
            asistencia.setEvento(evento);
        }

        if (request.isAsistio()) {
            asistencia.setEstado(EstadoAsistencia.CONFIRMADA);

            asistencia.setPuntosOtorgados(evento.getPuntosOtorga());
            asistencia.setConfirmadoEn(LocalDateTime.now());

            int puntosActuales = usuario.getPuntos() != null ? usuario.getPuntos() : 0;
            usuario.setPuntos(puntosActuales + evento.getPuntosOtorga());
            usuarioRepository.save(usuario);

        } else {
            asistencia.setEstado(EstadoAsistencia.NO_ASISTIO);
            asistencia.setPuntosOtorgados(0);
        }

        return asistenciaRepository.save(asistencia);
    }

    public List<Asistencia> listarAsistencias() {
        return asistenciaRepository.findAll();
    }

    public Optional<Asistencia> obtenerPorUsuarioYEvento(Long usuarioId, Long eventoId) {
        return asistenciaRepository.findByUsuarioIdAndEventoId(usuarioId, eventoId);
    }
}