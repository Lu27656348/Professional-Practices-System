package com.luiscarlossomoza.controllers;

import com.luiscarlossomoza.amazons3service.services.IS3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
public class S3Controller {
    @Autowired
    private IS3Service s3Service;

    @PostMapping("/upload")
    public String uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        return s3Service.uploadFile(file);
    }

    @GetMapping("/download/{fileName}")
    public String download(@PathVariable("fileName") String name) throws IOException {
        return s3Service.downloadFile(name);
    }

    @GetMapping("/list")
    public List<String > getAllObjects() throws IOException {
        return s3Service.listFiles();
    }

    @DeleteMapping("/delete/{fileName}")
    public String deleteFile(@PathVariable("fileName") String name){
        return s3Service.deleteFile(name);
    }
}
