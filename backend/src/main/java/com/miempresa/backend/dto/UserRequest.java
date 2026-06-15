package com.miempresa.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserRequest {

    @NotBlank
    private String username;

    private String password;

    @NotBlank
    private String name;

    private String email;
    private String role;
    private Boolean active;
}
