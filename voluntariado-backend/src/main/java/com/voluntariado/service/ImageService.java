package com.voluntariado.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class ImageService {

    @Value("${upload.path:uploads}")
    private String uploadPath;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    public String saveImage(MultipartFile file, String folder) throws IOException {
        // Convertir a ruta absoluta si es relativa
        String absoluteUploadPath = uploadPath;
        if (!uploadPath.startsWith("/") && !uploadPath.matches("^[A-Za-z]:.*")) {
            // Es una ruta relativa, convertirla a absoluta
            absoluteUploadPath = System.getProperty("user.dir") + "/" + uploadPath;
        }

        Path uploadDir = Paths.get(absoluteUploadPath, folder);
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : ".jpg";
        String filename = UUID.randomUUID().toString() + extension;

        Path filePath = uploadDir.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return baseUrl + "/uploads/" + folder + "/" + filename;
    }

    public boolean deleteImage(String imageUrl) {
        try {
            // Convertir a ruta absoluta si es relativa
            String absoluteUploadPath = uploadPath;
            if (!uploadPath.startsWith("/") && !uploadPath.matches("^[A-Za-z]:.*")) {
                absoluteUploadPath = System.getProperty("user.dir") + "/" + uploadPath;
            }
            
            String relativePath = imageUrl.replace(baseUrl + "/uploads/", "");
            Path filePath = Paths.get(absoluteUploadPath, relativePath);

            if (Files.exists(filePath)) {
                Files.delete(filePath);
                return true;
            }
            return false;
        } catch (IOException e) {
            throw new RuntimeException("Error al eliminar la imagen: " + e.getMessage());
        }
    }

    public boolean isValidImage(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null) return false;

        return contentType.equals("image/jpeg") ||
                contentType.equals("image/jpg") ||
                contentType.equals("image/png") ||
                contentType.equals("image/gif") ||
                contentType.equals("image/webp");
    }
}