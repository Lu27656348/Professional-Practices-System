package com.luiscarlossomoza.gwservice.auth;

import com.luiscarlossomoza.gwservice.entity.Role;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
     String userdni;
     String userpassword;
     String userfirstname;
     String userlastname;
     String useremailucab;
     String useremailalt;
     String userphone;
    @Enumerated(EnumType.STRING)
    private Role role;
}
