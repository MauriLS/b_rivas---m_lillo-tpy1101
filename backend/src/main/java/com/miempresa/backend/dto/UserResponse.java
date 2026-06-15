package com.miempresa.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String username;
    private String name;
    private String email;
    private String role;
    private Boolean active;
}
