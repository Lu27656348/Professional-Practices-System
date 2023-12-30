package com.luiscarlossomoza.gwservice.controller;

import com.luiscarlossomoza.gwservice.entity.Professor;
import com.luiscarlossomoza.gwservice.entity.Student;
import com.luiscarlossomoza.gwservice.service.ProfessorService;
import com.luiscarlossomoza.gwservice.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/students")
public class StudentController {
    private final StudentService studentService;

    @Autowired
    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping
    public Student createStudent (@RequestBody Student student){
        return studentService.createStudent(student);
    }

    @GetMapping
    public Iterable<Student> getAllStudents (){
        return studentService.getAllStudents();
    }

    @GetMapping("{id}")
    public Student getStudentById (@PathVariable String id){
        System.out.println("getProfessorById");
        System.out.println(id);
        return studentService.getStudentById(id);

    }
    @PutMapping("{id}")
    public Student updateStudent (@PathVariable String id, @RequestBody Student student){
        return studentService.updateStudent(id,student);
    }
    @DeleteMapping("{id}")
    public void deleteStudent(@PathVariable String id){
        studentService.deleteStudentById(id);
    }
}
