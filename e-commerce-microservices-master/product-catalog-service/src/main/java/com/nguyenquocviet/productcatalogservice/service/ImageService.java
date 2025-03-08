package com.nguyenquocviet.productcatalogservice.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class ImageService {

    @Value("${app.upload.dir}")
    private String uploadDir;

    public String storeImage(MultipartFile file) throws IOException {
        // Lấy đường dẫn tuyệt đối của thư mục gốc project
        String rootPath = new File("").getAbsolutePath();
        // Tạo đường dẫn đến thư mục images
        Path uploadPath = Paths.get(rootPath).getParent().resolve("images");
        
        // Tạo thư mục nếu chưa tồn tại
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Tạo tên file ngẫu nhiên để tránh trùng lặp
        String originalFileName = file.getOriginalFilename();
        String extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        String newFileName = UUID.randomUUID().toString() + extension;

        // Lưu file
        Path targetPath = uploadPath.resolve(newFileName);
        Files.copy(file.getInputStream(), targetPath);

        return newFileName;
    }

    public void deleteImage(String fileName) throws IOException {
        // Lấy đường dẫn tuyệt đối của thư mục gốc project
        String rootPath = new File("").getAbsolutePath();
        // Tạo đường dẫn đến file cần xóa
        Path filePath = Paths.get(rootPath).getParent().resolve("images").resolve(fileName);
        Files.deleteIfExists(filePath);
    }
}
