package com.fishingforum.service;

import com.fishingforum.dto.AuthRequest;
import com.fishingforum.dto.AuthResponse;
import com.fishingforum.dto.RegisterRequest;
import com.fishingforum.entity.Role;
import com.fishingforum.entity.User;
import com.fishingforum.entity.UserStatus;
import com.fishingforum.exception.ForbiddenException;
import com.fishingforum.repository.UserRepository;
import com.fishingforum.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already taken");
        }

        User user = User.builder()
            .username(request.getUsername())
            .email(request.getEmail())
            .passwordHash(passwordEncoder.encode(request.getPassword()))
            .status(UserStatus.ACTIVE)
            .createdAt(OffsetDateTime.now())
            .roles(Set.of(Role.ROLE_USER))
            .build();

        userRepository.save(user);
        String token = jwtService.generateToken(user);
        return new AuthResponse(token, user.getUsername(), toRoleNames(user));
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        if (user.getStatus() == UserStatus.BANNED &&
            (user.getBannedUntil() == null || user.getBannedUntil().isAfter(OffsetDateTime.now()))) {
            throw new ForbiddenException("User is banned");
        }

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, user.getUsername(), toRoleNames(user));
    }

    private Set<String> toRoleNames(User user) {
        return user.getRoles().stream().map(Enum::name).collect(Collectors.toSet());
    }
}
