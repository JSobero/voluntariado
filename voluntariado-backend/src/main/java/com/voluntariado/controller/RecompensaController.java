package com.voluntariado.controller;

import com.voluntariado.entity.Recompensa;
import com.voluntariado.service.RecompensaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/recompensas")
public class RecompensaController {

    private final RecompensaService recompensaService;

    public RecompensaController(RecompensaService recompensaService) {
        this.recompensaService = recompensaService;
    }

    @GetMapping
    public List<Recompensa> listar() {
        return recompensaService.listarRecompensas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Recompensa> obtener(@PathVariable Long id) {
        return recompensaService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Recompensa crear(@RequestBody Recompensa recompensa) {
        return recompensaService.guardarRecompensa(recompensa);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Recompensa> actualizar(@PathVariable Long id, @RequestBody Recompensa recompensa) {
        try {
            return ResponseEntity.ok(recompensaService.actualizarRecompensa(id, recompensa));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        recompensaService.eliminarRecompensa(id);
        return ResponseEntity.noContent().build();
    }
}
