package com.voluntariado.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class ImageService {

    private final Cloudinary cloudinary;

    @Value("${cloudinary.folder:voluntariado}")
    private String baseFolder;

    public ImageService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public String saveImage(MultipartFile file, String folder) throws IOException {
        String targetFolder = baseFolder + "/" + (folder == null ? "general" : folder);

        Map<?, ?> uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", targetFolder,
                        "resource_type", "image"
                )
        );

        return (String) uploadResult.get("secure_url");
    }

    public boolean deleteImage(String imageUrl) {
        try {
            String publicId = extractPublicId(imageUrl);
            if (publicId == null) return false;

            Map<?, ?> result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            Object status = result.get("result");
            return status != null && status.toString().equalsIgnoreCase("ok");
        } catch (Exception e) {
            return false;
        }
    }

    // Extrae el public_id desde la URL segura de Cloudinary
    private String extractPublicId(String imageUrl) {
        if (imageUrl == null || !imageUrl.contains("/upload/")) {
            return null;
        }

        try {
            String[] parts = imageUrl.split("/upload/");
            if (parts.length < 2) return null;

            String path = parts[1];
            // Quitar la versión (v123...)
            path = path.replaceFirst("^v\\d+/", "");

            int dotIndex = path.lastIndexOf('.');
            if (dotIndex > 0) {
                path = path.substring(0, dotIndex);
            }
            return path;
        } catch (Exception e) {
            return null;
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