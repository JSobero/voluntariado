package com.voluntariado.entity;

import com.voluntariado.enums.EstadoCanje;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "canje")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Canje {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "recompensa_id", nullable = false)
    private Recompensa recompensa;

    @Column(name = "fecha", updatable = false, insertable = false)
    private LocalDateTime fecha;

    @Column(name = "puntos_usados", nullable = false)
    private Integer puntosUsados;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoCanje estado = EstadoCanje.PENDIENTE;
}
