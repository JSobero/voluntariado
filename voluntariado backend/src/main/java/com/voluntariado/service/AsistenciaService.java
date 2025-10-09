package com.voluntariado.service;

import com.voluntariado.entity.Asistencia;
import com.voluntariado.repository.AsistenciaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AsistenciaService {

    private final AsistenciaRepository asistenciaRepository;

    public AsistenciaService(AsistenciaRepository asistenciaRepository) {
        this.asistenciaRepository = asistenciaRepository;
    }

    public List<Asistencia> listarAsistencias() {
        return asistenciaRepository.findAll();
    }

    public Optional<Asistencia> obtenerPorId(Long id) {
        return asistenciaRepository.findById(id);
    }

    public Asistencia guardarAsistencia(Asistencia asistencia) {
        return asistenciaRepository.save(asistencia);
    }

    public Asistencia actualizarAsistencia(Long id, Asistencia asistencia) {
        return asistenciaRepository.findById(id).map(a -> {
            a.setEstado(asistencia.getEstado());
            a.setPuntosOtorgados(asistencia.getPuntosOtorgados());
            return asistenciaRepository.save(a);
        }).orElseThrow(() -> new RuntimeException("Asistencia no encontrada"));
    }

    public void eliminarAsistencia(Long id) {
        asistenciaRepository.deleteById(id);
    }
}
