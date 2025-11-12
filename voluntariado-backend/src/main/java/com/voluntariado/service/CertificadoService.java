package com.voluntariado.service;

import com.voluntariado.entity.Certificado;
import com.voluntariado.repository.CertificadoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CertificadoService {

    private final CertificadoRepository certificadoRepository;

    public CertificadoService(CertificadoRepository certificadoRepository) {
        this.certificadoRepository = certificadoRepository;
    }

    public List<Certificado> listarCertificados() {
        return certificadoRepository.findAll();
    }

    public Optional<Certificado> obtenerPorId(Long id) {
        return certificadoRepository.findById(id);
    }

    public Certificado guardarCertificado(Certificado certificado) {
        return certificadoRepository.save(certificado);
    }

    public Certificado actualizarCertificado(Long id, Certificado certificado) {
        return certificadoRepository.findById(id).map(c -> {
            c.setUrlPdf(certificado.getUrlPdf());
            return certificadoRepository.save(c);
        }).orElseThrow(() -> new RuntimeException("Certificado no encontrado"));
    }

    public void eliminarCertificado(Long id) {
        certificadoRepository.deleteById(id);
    }
}
