package com.voluntariado.service;

import com.voluntariado.entity.Categoria;
import com.voluntariado.repository.CategoriaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    public List<Categoria> listar() {
        return categoriaRepository.findAll();
    }

    public Optional<Categoria> obtenerPorId(Long id) {
        return categoriaRepository.findById(id);
    }

    public Categoria guardar(Categoria c) {
        return categoriaRepository.save(c);
    }

    public Categoria actualizar(Long id, Categoria c) {
        return categoriaRepository.findById(id).map(existing -> {
            existing.setNombre(c.getNombre());
            existing.setDescripcion(c.getDescripcion());
            return categoriaRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Categoria no encontrada"));
    }

    public void eliminar(Long id) {
        categoriaRepository.deleteById(id);
    }
}
