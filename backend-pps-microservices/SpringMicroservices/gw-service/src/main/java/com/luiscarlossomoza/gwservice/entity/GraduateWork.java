package com.luiscarlossomoza.gwservice.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "graduateworks")
@Data
public class GraduateWork {
    @Id
    private String gwId;
}
