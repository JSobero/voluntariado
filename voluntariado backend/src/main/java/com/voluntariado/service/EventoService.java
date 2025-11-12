package com.voluntariado.service;

import com.voluntariado.entity.Evento;
import com.voluntariado.repository.EventoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventoService {

    private final EventoRepository eventoRepository;

    public EventoService(EventoRepository eventoRepository) {
        this.eventoRepository = eventoRepository;
    }

    public List<Evento> listarEventos() {
        return eventoRepository.findAll();
    }

    // ✅ NUEVO: Método para listar por categoría
    public List<Evento> listarPorCategoria(String categoria) {
        return eventoRepository.findByCategoria(categoria);
    }

    public Optional<Evento> obtenerPorId(Long id) {
        return eventoRepository.findById(id);
    }

    public Evento guardarEvento(Evento evento) {
        return eventoRepository.save(evento);
    }

    public Evento actualizarEvento(Long id, Evento evento) {
        return eventoRepository.findById(id).map(e -> {
            e.setTitulo(evento.getTitulo());
            e.setDescripcion(evento.getDescripcion());
            e.setCategoria(evento.getCategoria()); // ✅ AÑADIDO
            e.setLugar(evento.getLugar());
            e.setFechaInicio(evento.getFechaInicio());
            e.setFechaFin(evento.getFechaFin());
            e.setCupoMaximo(evento.getCupoMaximo());
            e.setOrganizador(evento.getOrganizador());
            e.setImagenUrl(evento.getImagenUrl());
            return eventoRepository.save(e);
        }).orElseThrow(() -> new RuntimeException("Evento no encontrado"));
    }

    public void eliminarEvento(Long id) {
        eventoRepository.deleteById(id);
    }
}