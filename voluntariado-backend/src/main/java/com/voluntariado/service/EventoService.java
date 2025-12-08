package com.voluntariado.service;

import com.voluntariado.entity.Evento;
import com.voluntariado.repository.EventoRepository;
import com.voluntariado.repository.InscripcionRepository; // <-- 1. IMPORTAR
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventoService {

    private final EventoRepository eventoRepository;

    private final InscripcionRepository inscripcionRepository;

    public EventoService(EventoRepository eventoRepository,
                         InscripcionRepository inscripcionRepository) {
        this.eventoRepository = eventoRepository;
        this.inscripcionRepository = inscripcionRepository;
    }

    public List<Evento> listarEventos() {
        List<Evento> eventos = eventoRepository.findAll();

        eventos.forEach(evento -> {
            long count = inscripcionRepository.countByEventoId(evento.getId());

            evento.setInscritos(count);
        });

        return eventos;
    }


    public List<Evento> listarPorCategoria(Long categoriaId) {
        List<Evento> eventos = eventoRepository.findByCategoriaId(categoriaId);
        eventos.forEach(evento -> {
            long count = inscripcionRepository.countByEventoId(evento.getId());
            evento.setInscritos(count);
        });
        return eventos;
    }

    public Optional<Evento> obtenerPorId(Long id) {

        return eventoRepository.findById(id).map(evento -> {
            long count = inscripcionRepository.countByEventoId(evento.getId());
            evento.setInscritos(count);
            return evento;
        });
    }

    public Evento guardarEvento(Evento evento) {
        Evento eventoGuardado = eventoRepository.save(evento);
        eventoGuardado.setInscritos(0);
        return eventoGuardado;
    }

    public Evento actualizarEvento(Long id, Evento evento) {
        return eventoRepository.findById(id).map(e -> {
            e.setTitulo(evento.getTitulo());
            e.setDescripcion(evento.getDescripcion());
            e.setCategoria(evento.getCategoria());
            e.setLugar(evento.getLugar());
            e.setFechaInicio(evento.getFechaInicio());
            e.setFechaFin(evento.getFechaFin());
            e.setCupoMaximo(evento.getCupoMaximo());
            e.setOrganizador(evento.getOrganizador());
            e.setImagenUrl(evento.getImagenUrl());
            e.setPuntosOtorga(evento.getPuntosOtorga());

            Evento eventoGuardado = eventoRepository.save(e);

            long count = inscripcionRepository.countByEventoId(eventoGuardado.getId());
            eventoGuardado.setInscritos(count);
            return eventoGuardado;

        }).orElseThrow(() -> new RuntimeException("Evento no encontrado"));
    }

    public void eliminarEvento(Long id) {
        eventoRepository.deleteById(id);
    }
}