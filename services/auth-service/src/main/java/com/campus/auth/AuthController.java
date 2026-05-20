package com.campus.auth;

import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("service", "auth-service", "status", "ok");
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        String email = body.getOrDefault("email", "student@campus.edu");
        return Map.of(
            "token", UUID.randomUUID().toString(),
            "user", Map.of("email", email, "role", "student"),
            "provider", "Spring Boot Auth Microservice"
        );
    }
}
