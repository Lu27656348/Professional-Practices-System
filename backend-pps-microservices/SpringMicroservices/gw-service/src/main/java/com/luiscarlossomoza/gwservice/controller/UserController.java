package com.luiscarlossomoza.gwservice.controller;

import com.luiscarlossomoza.gwservice.entity.User;
import com.luiscarlossomoza.gwservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService){
        this.userService = userService;
    }

    @PostMapping
    public User createUser(@RequestBody User user){
        return userService.createUser(user);
    }

    @GetMapping
    public List<User> getAllUsers(){
        return userService.getAllUsers();
    }

    @GetMapping("{id}")
    public User getUserById(String id){
        return userService.getUserById(id);
    }

    @PutMapping("{id}")
    public User updateUser(@PathVariable String id, @RequestBody User user){
        return userService.updateUser(id,user);
    }

    @DeleteMapping("{id}")
    public void deleteUser(@PathVariable String id){
        userService.deleteUserById(id);
    }
}
