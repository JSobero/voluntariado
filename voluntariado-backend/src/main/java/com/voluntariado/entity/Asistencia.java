package com.voluntariado.entity;

import com.voluntariado.enums.EstadoAsistencia;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "asistencia")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Asistencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "evento_id", nullable = false)
    private Evento evento;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoAsistencia estado = EstadoAsistencia.NO_ASISTIO;

    @Column(name = "puntos_otorgados", nullable = false)
    private Integer puntosOtorgados = 0;

    @Column(name = "confirmado_en", updatable = false, insertable = false)
    private LocalDateTime confirmadoEn;
}
