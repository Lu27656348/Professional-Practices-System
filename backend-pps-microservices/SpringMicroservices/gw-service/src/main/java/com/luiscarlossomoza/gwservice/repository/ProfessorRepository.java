package com.luiscarlossomoza.gwservice.repository;

import com.luiscarlossomoza.gwservice.entity.Professor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfessorRepository extends CrudRepository<Professor,String> {
}
