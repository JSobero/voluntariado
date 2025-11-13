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

    // --- 👇 2. AÑADE ESTE REPOSITORIO 👇 ---
    private final InscripcionRepository inscripcionRepository;

    // --- 👇 3. MODIFICA EL CONSTRUCTOR 👇 ---
    public EventoService(EventoRepository eventoRepository,
                         InscripcionRepository inscripcionRepository) { // <-- Añadir
        this.eventoRepository = eventoRepository;
        this.inscripcionRepository = inscripcionRepository; // <-- Añadir
    }

    // --- 👇 4. MODIFICA 'listarEventos' (LA CLAVE) 👇 ---
    public List<Evento> listarEventos() {
        // 1. Obtenemos todos los eventos como siempre
        List<Evento> eventos = eventoRepository.findAll();

        // 2. Iteramos sobre la lista
        eventos.forEach(evento -> {
            // 3. Para CADA evento, calculamos sus inscritos
            // (Si quieres contar solo aceptadas, usa:
            // long count = inscripcionRepository.countByEventoIdAndEstado(evento.getId(), "ACEPTADA");
            long count = inscripcionRepository.countByEventoId(evento.getId());

            // 4. Asignamos el conteo al campo @Transient
            evento.setInscritos(count);
        });

        // 5. Devolvemos la lista "enriquecida"
        return eventos;
    }

    // ✅ NUEVO: Método para listar por categoría
    public List<Evento> listarPorCategoria(String categoria) {
        // También "enriquecemos" esta lista
        List<Evento> eventos = eventoRepository.findByCategoria(categoria);
        eventos.forEach(evento -> {
            long count = inscripcionRepository.countByEventoId(evento.getId());
            evento.setInscritos(count);
        });
        return eventos;
    }

    public Optional<Evento> obtenerPorId(Long id) {
        // También "enriquecemos" este
        return eventoRepository.findById(id).map(evento -> {
            long count = inscripcionRepository.countByEventoId(evento.getId());
            evento.setInscritos(count);
            return evento;
        });
    }

    public Evento guardarEvento(Evento evento) {
        // Al guardar, no necesitamos el conteo, pero lo ponemos para consistencia
        Evento eventoGuardado = eventoRepository.save(evento);
        eventoGuardado.setInscritos(0); // Un evento nuevo tiene 0 inscritos
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

            Evento eventoGuardado = eventoRepository.save(e);

            // Calculamos los inscritos después de guardar
            long count = inscripcionRepository.countByEventoId(eventoGuardado.getId());
            eventoGuardado.setInscritos(count);
            return eventoGuardado;

        }).orElseThrow(() -> new RuntimeException("Evento no encontrado"));
    }

    public void eliminarEvento(Long id) {
        eventoRepository.deleteById(id);
    }
}