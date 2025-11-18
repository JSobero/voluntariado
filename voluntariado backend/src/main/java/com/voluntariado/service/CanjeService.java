package com.voluntariado.service;

import com.voluntariado.entity.Canje;
import com.voluntariado.entity.Recompensa;
import com.voluntariado.entity.Usuario;
import com.voluntariado.enums.EstadoCanje;
import com.voluntariado.repository.CanjeRepository;
import com.voluntariado.repository.RecompensaRepository;
import com.voluntariado.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CanjeService {

    private final CanjeRepository canjeRepository;
    private final UsuarioRepository usuarioRepository;
    private final RecompensaRepository recompensaRepository;

    public CanjeService(CanjeRepository canjeRepository,
                        UsuarioRepository usuarioRepository,
                        RecompensaRepository recompensaRepository) {
        this.canjeRepository = canjeRepository;
        this.usuarioRepository = usuarioRepository;
        this.recompensaRepository = recompensaRepository;
    }

    public List<Canje> listarCanjes() {
        return canjeRepository.findAll();
    }

    public Optional<Canje> obtenerPorId(Long id) {
        return canjeRepository.findById(id);
    }

    @Transactional
    public Canje guardarCanje(Canje canjeRequest) {
        // 1. Obtener los IDs de la solicitud
        Long usuarioId = canjeRequest.getUsuario().getId();
        Long recompensaId = canjeRequest.getRecompensa().getId();

        // 2. Obtener las entidades reales de la base de datos
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + usuarioId));
        Recompensa recompensa = recompensaRepository.findById(recompensaId)
                .orElseThrow(() -> new RuntimeException("Recompensa no encontrada con ID: " + recompensaId));

        // 3. Realizar validaciones de negocio
        if (recompensa.getStock() <= 0) {
            throw new RuntimeException("Stock agotado para esta recompensa");
        }
        if (usuario.getPuntos() < recompensa.getPuntosNecesarios()) {
            throw new RuntimeException("No tienes suficientes puntos para canjear esta recompensa");
        }

        // 4. Realizar operaciones (transaccional)
        usuario.setPuntos(usuario.getPuntos() - recompensa.getPuntosNecesarios());
        recompensa.setStock(recompensa.getStock() - 1);

        usuarioRepository.save(usuario);
        recompensaRepository.save(recompensa);

        // 5. Crear la entidad Canje (ahora que es válida)
        Canje nuevoCanje = new Canje();
        nuevoCanje.setUsuario(usuario);
        nuevoCanje.setRecompensa(recompensa);
        nuevoCanje.setPuntosUsados(recompensa.getPuntosNecesarios());
        nuevoCanje.setEstado(EstadoCanje.PENDIENTE); // El estado por defecto

        return canjeRepository.save(nuevoCanje);
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

    public List<Canje> listarCanjesPorUsuario(Long usuarioId) {
        return canjeRepository.findByUsuarioId(usuarioId);
    }
}
