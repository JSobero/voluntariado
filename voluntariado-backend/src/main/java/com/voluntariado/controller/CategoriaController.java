package com.voluntariado.controller;

import com.voluntariado.entity.Categoria;
import com.voluntariado.service.CategoriaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categorias")
public class CategoriaController {

    private final CategoriaService service;

    public CategoriaController(CategoriaService service) {
        this.service = service;
    }

    @GetMapping
    public List<Categoria> listar() { return service.listar(); }

    @GetMapping("/{id}")
    public ResponseEntity<Categoria> obtener(@PathVariable Long id) {
        return service.obtenerPorId(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Categoria crear(@RequestBody Categoria c) { return service.guardar(c); }

    @PutMapping("/{id}")
    public ResponseEntity<Categoria> actualizar(@PathVariable Long id, @RequestBody Categoria c) {
        try {
            return ResponseEntity.ok(service.actualizar(id, c));
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
