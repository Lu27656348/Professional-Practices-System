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
public class User implements UserDetails {
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
   // @Enumerated(EnumType.STRING)
   // private Role role;
/*
    public User(String userdni, String userpassword, String userfirstname, String userlastname, String useremailucab, String useremailalt, String userphone) {
        this.userDNI = userdni;
        this.userPassword = userpassword;
        this.userFirstName = userfirstname;
        this.userLastName = userlastname;
        this.userEmailUcab = useremailucab;
        this.userEmailAlt = useremailalt;
        this.userPhone = userphone;

    }
*/
    public Collection<? extends GrantedAuthority> getAuthorities(){
        return List.of(new SimpleGrantedAuthority(Role.PROFESSOR.name()));
    }

    @Override
    public String getPassword() {
        return this.getUserPassword();
    }

    @Override
    public String getUsername() {
        return this.getUserDNI();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
