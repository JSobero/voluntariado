package com.voluntariado.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "recompensa")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recompensa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "costo_puntos", nullable = false)
    private Integer puntosNecesarios;

    @Column(nullable = false)
    private Integer stock;
}
