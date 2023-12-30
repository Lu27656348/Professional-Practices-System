package com.luiscarlossomoza.gwservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "professors")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Professor {
    @Id
    String professorDNI;

    @Column(name = "professorschoolname")
    String professorSchoolName;
    @Column(name = "professoroffice")
    String professorOffice;
    @Column(name = "professorworkexperience")
    String professorWorkExperience;
    @Column(name = "professorgraduationyear")
    String professorGraduationYear;
    @Column(name = "professoraddress")
    String professorAddress;
    @Column(name = "professorprofession")
    String professorProfession;

}
