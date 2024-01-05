package com.luiscarlossomoza.services.impl;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.*;
import com.amazonaws.util.IOUtils;
import com.luiscarlossomoza.interfaces.FileNameProjection;
import com.luiscarlossomoza.interfaces.ValidateFileNameRequest;
import com.luiscarlossomoza.services.IS3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class S3ServiceImpl implements IS3Service {
    private final AmazonS3 s3client;
    private final String FOLDER_NAME = "proposal/";
    private final String PDF_EXTENSION = ".pdf";



    @Autowired
    public S3ServiceImpl(AmazonS3 s3client){
        this.s3client = s3client;
    }

    public Boolean validateFileName( ValidateFileNameRequest fileNameRequest ){
        System.out.println(fileNameRequest.getFileName());
        String regexValidator = "^[A-Z]{1}[a-z]+[A-Z]{1}[a-z]+(\s?[A-Z]{1}[a-z]+[A-Z]{1}[a-z]+)?\s(PTG|TG|Pasantía|SC|Propuesta\sPasantía|Propuesta\sSC)$";
        Pattern pattern = Pattern.compile(regexValidator);
        Matcher matcher = pattern.matcher(fileNameRequest.getFileName());

        if (matcher.matches()) {
            return true;
        }

        return false;
    }

    public String uploadFile(MultipartFile file) throws IOException {
        try (InputStream is = file.getInputStream()) {
            //Validamos el nombre del archivo
            System.out.println("Nombre del archivo = " + file.getOriginalFilename().replace(PDF_EXTENSION,""));
            if(validateFileName(new ValidateFileNameRequest(file.getOriginalFilename().replace(PDF_EXTENSION,"")))){
                File fileTemp = File.createTempFile("upload", ".tmp");
                file.transferTo(fileTemp);
                s3client.putObject(new PutObjectRequest("bucket-gw-storage",FOLDER_NAME + file.getOriginalFilename(),fileTemp));
                return "Archivo subido correctamente";
            }else{
                return "El nombre del archivo no cuenta con el formato correcto";
            }


        } catch (IOException e) {
            throw new IOException(e.getMessage());
        }
    }

    public void downloadFile(String fileName) {
        return;
    }

    public List<String> listFiles() throws IOException {
        try {
            ListObjectsV2Result result = s3client.listObjectsV2("bucket-gw-storage");
            List<S3ObjectSummary> objects = result.getObjectSummaries();
            List<String> fileNames = new ArrayList<>();
            for (S3ObjectSummary os : objects) {
                System.out.println("* " + os.getKey());
                fileNames.add(os.getKey());
            }
            return fileNames;
        }catch (AmazonServiceException e){
            throw new IOException(e.getMessage());
        }
    }

    public String deleteFile(String fileName){
        try{
            s3client.deleteObject("bucket-gw-storage",fileName);
            return "Archivo eliminado exitosamente";
        }catch (AmazonServiceException e){
            throw new AmazonServiceException(e.getMessage());
        }
    }
}


