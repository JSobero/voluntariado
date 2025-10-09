package com.voluntariado.service;

import com.voluntariado.entity.Canje;
import com.voluntariado.repository.CanjeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CanjeService {

    private final CanjeRepository canjeRepository;

    public CanjeService(CanjeRepository canjeRepository) {
        this.canjeRepository = canjeRepository;
    }

    public List<Canje> listarCanjes() {
        return canjeRepository.findAll();
    }

    public Optional<Canje> obtenerPorId(Long id) {
        return canjeRepository.findById(id);
    }

    public Canje guardarCanje(Canje canje) {
        return canjeRepository.save(canje);
    }

    public Canje actualizarCanje(Long id, Canje canje) {
        return canjeRepository.findById(id).map(c -> {
            c.setEstado(canje.getEstado());
            return canjeRepository.save(c);
        }).orElseThrow(() -> new RuntimeException("Canje no encontrado"));
    }

    public void eliminarCanje(Long id) {
        canjeRepository.deleteById(id);
    }
}
