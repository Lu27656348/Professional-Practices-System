package com.luiscarlossomoza.gwservice.controller;

import com.luiscarlossomoza.gwservice.entity.Professor;
import com.luiscarlossomoza.gwservice.service.ProfessorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/professors")
public class ProfessorController {
    private final ProfessorService professorService;

    @Autowired
    public ProfessorController(ProfessorService professorService) {
        this.professorService = professorService;
    }

    @PostMapping
    public Professor createProfessor (@RequestBody Professor professor){
        System.out.println("createProfessor");
        System.out.println(professor);
        return professorService.createProfessor(professor);
    }

    @GetMapping
    public Iterable<Professor> getAllProfessors (){
        return  professorService.getAllProfessors();
    }

    @GetMapping("{id}")
    public Professor getProfessorById (@PathVariable String id){
        System.out.println("getProfessorById");
        System.out.println(id);
        return professorService.getProfessorById(id);

    }
    @PutMapping("{id}")
    public Professor updateProfessor (@PathVariable String id, @RequestBody Professor professor){
        return professorService.updateProfessor(id,professor);
    }
    @DeleteMapping("{id}")
    public void deleteProfessor (@PathVariable String id){
        professorService.deleteProfessorById(id);
    }
}
