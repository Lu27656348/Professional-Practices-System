package com.luiscarlossomoza.gwservice.service;

import com.luiscarlossomoza.gwservice.entity.User;
import com.luiscarlossomoza.gwservice.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @Transactional
    public User createUser (User user){
        return userRepository.save(user);
    }

    public Iterable<User> getAllUsers(){
        return userRepository.findAll();
    }

    public User getUserById(String id){
        return userRepository.findById(id).orElse(null);
    }

    @Transactional
    public User updateUser(String id, User user){
        User existingUser = userRepository.findById(id).orElse(null);
        if(existingUser != null){
            existingUser.setUserFirstName(user.getUserFirstName());
            existingUser.setUserLastName(user.getUserLastName());
            return userRepository.save(existingUser);
        }
        return null;
    }
    @Transactional
    public void deleteUserById(String id){
        userRepository.deleteById(id);
    }


}
