package com.luiscarlossomoza.services.impl;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.*;
import com.luiscarlossomoza.services.IS3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

@Service
public class S3ServiceImpl implements IS3Service {
    private final AmazonS3 s3client;

    @Autowired
    public S3ServiceImpl(AmazonS3 s3client){
        this.s3client = s3client;
    }


    public String uploadFile(MultipartFile file) throws IOException {
        try (InputStream is = file.getInputStream()) {
            // Crear un archivo temporal
            File fileTemp = File.createTempFile("upload", ".tmp");
            file.transferTo(fileTemp);
            s3client.putObject(new PutObjectRequest("bucket-gw-storage",file.getOriginalFilename(),fileTemp));
            return "Archivo subido correctamente";
        } catch (IOException e) {
            throw new IOException(e.getMessage());
        }
    }

    public String downloadFile(String fileName) {
        try{
            String downloadsPath = System.getProperty("user.home") + "/Downloads";
            //final AmazonS3 s3 = AmazonS3ClientBuilder.standard().withRegion(Regions.US_EAST_2).build();
            S3Object o = s3client.getObject("bucket-gw-storage",fileName);
            S3ObjectInputStream s3is = o.getObjectContent();
            FileOutputStream fos = new FileOutputStream(new File(downloadsPath,fileName));
            byte[] read_buf = new byte[1024];
            int read_len = 0;
            while ((read_len = s3is.read(read_buf)) > 0) {
                fos.write(read_buf, 0, read_len);
            }
            s3is.close();
            fos.close();
            return "Archivo descargado correctamente";

        }catch (AmazonServiceException e){
            return "Error en conexión con el servicio de Amazon";
        }catch (FileNotFoundException e){
            return "El Archivo no existe en el bucket";
        }catch (IOException e){
            return "Error en la ejecución del programa";
        }
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


