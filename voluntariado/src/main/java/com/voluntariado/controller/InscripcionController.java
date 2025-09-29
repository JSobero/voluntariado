package com.voluntariado.controller;

import com.voluntariado.entity.Inscripcion;
import com.voluntariado.service.InscripcionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inscripciones")
public class InscripcionController {

    private final InscripcionService inscripcionService;

    public InscripcionController(InscripcionService inscripcionService) {
        this.inscripcionService = inscripcionService;
    }

    @GetMapping
    public List<Inscripcion> listarInscripciones() {
        return inscripcionService.listarInscripciones();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Inscripcion> obtenerPorId(@PathVariable Long id) {
        return inscripcionService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Inscripcion crear(@RequestBody Inscripcion inscripcion) {
        return inscripcionService.guardarInscripcion(inscripcion);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Inscripcion> actualizar(@PathVariable Long id, @RequestBody Inscripcion inscripcion) {
        try {
            return ResponseEntity.ok(inscripcionService.actualizarInscripcion(id, inscripcion));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        inscripcionService.eliminarInscripcion(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<Inscripcion> listarPorUsuario(@PathVariable Long usuarioId) {
        return inscripcionService.listarPorUsuario(usuarioId);
    }

    @GetMapping("/evento/{eventoId}")
    public List<Inscripcion> listarPorEvento(@PathVariable Long eventoId) {
        return inscripcionService.listarPorEvento(eventoId);
    }
}
