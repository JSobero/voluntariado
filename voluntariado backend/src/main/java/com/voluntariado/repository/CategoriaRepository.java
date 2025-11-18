package com.voluntariado.repository;

import com.voluntariado.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    @Query("SELECT DISTINCT e.categoria FROM Evento e WHERE e.categoria IS NOT NULL")
    List<Categoria> findCategoriasDeEventos();
}