package com.luiscarlossomoza.gwservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "students")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Student {

    @Id
    private String studentDNI;

    @Column(name = "studentschoolname")
    private String studentSchoolName;
    @Column(name = "studentsemester")
    private String studentSemester;
    @Column(name = "studentaddress")
    private String studentAddress;
    @Column(name = "studentoffice")
    private String studentOffice;
}
