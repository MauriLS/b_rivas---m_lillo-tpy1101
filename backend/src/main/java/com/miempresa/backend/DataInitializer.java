package com.miempresa.backend;

import com.miempresa.backend.model.User;
import com.miempresa.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        userRepository.save(User.builder()
                .username("admin")
                .password(passwordEncoder.encode("admin123"))
                .name("Administrador")
                .email("admin@ejemplo.com")
                .role("ADMIN")
                .active(true)
                .build());

        userRepository.save(User.builder()
                .username("juan.perez")
                .password(passwordEncoder.encode("pass123"))
                .name("Juan Pérez")
                .email("juan.perez@ejemplo.com")
                .role("USER")
                .active(true)
                .build());

        userRepository.save(User.builder()
                .username("maria.gonzalez")
                .password(passwordEncoder.encode("pass123"))
                .name("María González")
                .email("maria.gonzalez@ejemplo.com")
                .role("USER")
                .active(true)
                .build());
    }
}
