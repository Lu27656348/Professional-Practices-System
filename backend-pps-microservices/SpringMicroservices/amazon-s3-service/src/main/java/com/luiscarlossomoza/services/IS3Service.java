package com.luiscarlossomoza.services;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface IS3Service {
    String uploadFile(MultipartFile file) throws IOException;
    String downloadFile(String fileName);
    List<String> listFiles() throws IOException;
    String deleteFile(String fileName);

}
