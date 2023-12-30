package com.luiscarlossomoza.gwservice.service;

import com.luiscarlossomoza.gwservice.entity.Professor;
import com.luiscarlossomoza.gwservice.repository.ProfessorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProfessorService {
    private final ProfessorRepository professorRepository;

    @Autowired
    public ProfessorService(ProfessorRepository professorRepository) {
        this.professorRepository = professorRepository;
    }

    public Professor createProfessor (Professor professor){
        return professorRepository.save(professor);
    }

    public Iterable<Professor> getAllProfessors(){
        return professorRepository.findAll();
    }

    public Professor getProfessorById(String id){
        return professorRepository .findById(id).orElse(null);
    }

    public Professor updateProfessor(String id, Professor professor){
        Professor existingProfessor = professorRepository.findById(id).orElse(null);
        if(existingProfessor != null){
            existingProfessor.setProfessorAddress(professor.getProfessorAddress());
            existingProfessor.setProfessorOffice(professor.getProfessorOffice());
            existingProfessor.setProfessorGraduationYear(professor.getProfessorGraduationYear());
            existingProfessor.setProfessorSchoolName(professor.getProfessorSchoolName());
            existingProfessor.setProfessorWorkExperience(professor.getProfessorWorkExperience());
            return professorRepository.save(existingProfessor);
        }
        return null;
    }

    public void deleteProfessorById (String id){
        professorRepository.deleteById(id);
    }
}
