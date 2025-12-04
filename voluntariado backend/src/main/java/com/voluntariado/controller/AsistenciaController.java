package com.voluntariado.controller;

import com.voluntariado.dto.AsistenciaRequestDTO;
import com.voluntariado.entity.Asistencia;
import com.voluntariado.service.AsistenciaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/asistencias")

public class AsistenciaController {

    private final AsistenciaService asistenciaService;

    public AsistenciaController(AsistenciaService asistenciaService) {
        this.asistenciaService = asistenciaService;
    }

    // 💡 Endpoint principal para marcar el checkbox desde Angular
    @PostMapping("/registrar")
    public ResponseEntity<Asistencia> registrar(@RequestBody AsistenciaRequestDTO request) {
        try {
            Asistencia asistencia = asistenciaService.registrarAsistencia(request);
            return ResponseEntity.ok(asistencia);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public List<Asistencia> listarAsistencias() {
        return asistenciaService.listarAsistencias();
    }

    // Endpoint útil para pintar los checkboxes al cargar la página
    @GetMapping("/verificar")
    public ResponseEntity<Asistencia> obtenerPorUsuarioYEvento(
            @RequestParam Long usuarioId,
            @RequestParam Long eventoId) {
        return asistenciaService.obtenerPorUsuarioYEvento(usuarioId, eventoId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }
}