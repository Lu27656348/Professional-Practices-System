package com.luiscarlossomoza.gwservice.repository;

import com.luiscarlossomoza.gwservice.entity.Student;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends CrudRepository<Student,String> {
}
