package com.voluntariado.controller;

import com.voluntariado.entity.Canje;
import com.voluntariado.service.CanjeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/canjes")
public class CanjeController {

    private final CanjeService canjeService;

    public CanjeController(CanjeService canjeService) {
        this.canjeService = canjeService;
    }

    @GetMapping
    public List<Canje> listarCanjes() {
        return canjeService.listarCanjes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Canje> obtenerCanje(@PathVariable Long id) {
        return canjeService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Canje crearCanje(@RequestBody Canje canje) {
        return canjeService.guardarCanje(canje);
    }

    @PutMapping("/{id}")
    public Canje actualizarCanje(@PathVariable Long id, @RequestBody Canje canje) {
        return canjeService.actualizarCanje(id, canje);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCanje(@PathVariable Long id) {
        canjeService.eliminarCanje(id);
        return ResponseEntity.noContent().build();
    }
}
