package com.luiscarlossomoza.gwservice.auth;

import com.luiscarlossomoza.gwservice.entity.Role;
import com.luiscarlossomoza.gwservice.entity.User;
import com.luiscarlossomoza.gwservice.repository.UserRepository;
import com.luiscarlossomoza.gwservice.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    public AuthResponse login(LoginRequest request){
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(),request.getPassword()));
        UserDetails user = userRepository.findById(request.getUsername()).orElseThrow();
        String token = jwtService.getToken(user);
        return  AuthResponse.builder()
                .token(token).build();
    }

    public AuthResponse register(RegisterRequest request){
        com.luiscarlossomoza.gwservice.entity.User user = new User(request.getUserdni(),passwordEncoder.encode(request.getUserpassword()), request.getUserfirstname(), request.getUserlastname(), request.getUseremailucab(),request.getUseremailalt(), request.getUserphone());
        userRepository.save(user);

        return AuthResponse.builder().token(jwtService.getToken(user)).build();
    }
}
