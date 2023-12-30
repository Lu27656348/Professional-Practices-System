package com.luiscarlossomoza.gwservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    private String userDNI;

    @Column(name = "userpassword")
    private String userPassword;
    @Column(name = "userfirstname")
    private String userFirstName;
    @Column(name = "userlastname")
    private String userLastName;
    @Column(name = "useremailucab")
    private String userEmailUcab;
    @Column(name = "useremailalt")
    private String userEmailAlt;
    @Column(name = "userphone")
    private String userPhone;

}
