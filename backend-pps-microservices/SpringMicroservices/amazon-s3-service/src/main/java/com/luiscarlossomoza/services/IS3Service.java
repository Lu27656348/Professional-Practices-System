package com.luiscarlossomoza.services;

import com.luiscarlossomoza.interfaces.FileNameProjection;
import com.luiscarlossomoza.interfaces.ValidateFileNameRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface IS3Service {
    String uploadFile(MultipartFile file) throws IOException;
    void downloadFile(String fileName);
    List<String> listFiles() throws IOException;
    String deleteFile(String fileName);

    Boolean validateFileName(ValidateFileNameRequest fileName);

}
