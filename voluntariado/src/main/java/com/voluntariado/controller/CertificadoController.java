package com.voluntariado.controller;

import com.voluntariado.entity.Certificado;
import com.voluntariado.service.CertificadoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/certificados")
public class CertificadoController {

    private final CertificadoService certificadoService;

    public CertificadoController(CertificadoService certificadoService) {
        this.certificadoService = certificadoService;
    }

    @GetMapping
    public List<Certificado> listarCertificados() {
        return certificadoService.listarCertificados();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Certificado> obtenerCertificado(@PathVariable Long id) {
        return certificadoService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Certificado crearCertificado(@RequestBody Certificado certificado) {
        return certificadoService.guardarCertificado(certificado);
    }

    @PutMapping("/{id}")
    public Certificado actualizarCertificado(@PathVariable Long id, @RequestBody Certificado certificado) {
        return certificadoService.actualizarCertificado(id, certificado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCertificado(@PathVariable Long id) {
        certificadoService.eliminarCertificado(id);
        return ResponseEntity.noContent().build();
    }
}
