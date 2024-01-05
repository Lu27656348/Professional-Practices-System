package com.luiscarlossomoza;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableAutoConfiguration
public class AmazonS3ServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(AmazonS3ServiceApplication.class, args);
	}

}
