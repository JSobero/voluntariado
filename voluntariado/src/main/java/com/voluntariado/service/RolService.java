package com.voluntariado.service;

import com.voluntariado.entity.Rol;
import com.voluntariado.repository.RolRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RolService {

    private final RolRepository rolRepository;

    public RolService(RolRepository rolRepository) {
        this.rolRepository = rolRepository;
    }

    // Listar todos los roles
    public List<Rol> listarRoles() {
        return rolRepository.findAll();
    }

    // Obtener rol por ID
    public Optional<Rol> obtenerPorId(Long id) {
        return rolRepository.findById(id);
    }

    // Guardar un nuevo rol
    public Rol guardarRol(Rol rol) {
        return rolRepository.save(rol);
    }

    // Actualizar rol existente
    public Rol actualizarRol(Long id, Rol rol) {
        return rolRepository.findById(id).map(r -> {
            r.setNombre(rol.getNombre());
            return rolRepository.save(r);
        }).orElseThrow(() -> new RuntimeException("Rol no encontrado"));
    }

    // Eliminar rol por ID
    public void eliminarRol(Long id) {
        rolRepository.deleteById(id);
    }
}
