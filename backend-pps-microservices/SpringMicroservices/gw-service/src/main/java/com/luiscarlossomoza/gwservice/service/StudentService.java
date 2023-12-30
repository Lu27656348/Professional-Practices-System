package com.luiscarlossomoza.gwservice.service;

import com.luiscarlossomoza.gwservice.entity.Student;
import com.luiscarlossomoza.gwservice.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StudentService {
    private final StudentRepository studentRepository;

    @Autowired
    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public Student createStudent (Student student){
        return studentRepository.save(student);
    }

    public Iterable<Student> getAllStudents(){
        return studentRepository.findAll();
    }

    public Student getStudentById(String id){
        return studentRepository .findById(id).orElse(null);
    }

    public Student updateStudent(String id, Student student){
        Student existingStudent = studentRepository.findById(id).orElse(null);
        if(existingStudent != null){
            return studentRepository.save(existingStudent);
        }
        return null;
    }

    public void deleteStudentById (String id){
        studentRepository.deleteById(id);
    }
}
