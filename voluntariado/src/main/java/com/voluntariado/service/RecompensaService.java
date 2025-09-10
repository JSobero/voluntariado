package com.voluntariado.service;

import com.voluntariado.entity.Recompensa;
import com.voluntariado.repository.RecompensaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RecompensaService {

    private final RecompensaRepository recompensaRepository;

    public RecompensaService(RecompensaRepository recompensaRepository) {
        this.recompensaRepository = recompensaRepository;
    }

    public List<Recompensa> listarRecompensas() {
        return recompensaRepository.findAll();
    }

    public Optional<Recompensa> obtenerPorId(Long id) {
        return recompensaRepository.findById(id);
    }

    public Recompensa guardarRecompensa(Recompensa recompensa) {
        return recompensaRepository.save(recompensa);
    }

    public Recompensa actualizarRecompensa(Long id, Recompensa recompensa) {
        return recompensaRepository.findById(id).map(r -> {
            r.setNombre(recompensa.getNombre());
            r.setDescripcion(recompensa.getDescripcion());
            r.setPuntosNecesarios(recompensa.getPuntosNecesarios());
            r.setStock(recompensa.getStock());
            return recompensaRepository.save(r);
        }).orElseThrow(() -> new RuntimeException("Recompensa no encontrada"));
    }

    public void eliminarRecompensa(Long id) {
        recompensaRepository.deleteById(id);
    }
}
