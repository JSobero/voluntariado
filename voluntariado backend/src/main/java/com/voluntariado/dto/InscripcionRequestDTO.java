package com.voluntariado.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InscripcionRequestDTO {
    private Long usuarioId;
    private Long eventoId;
}