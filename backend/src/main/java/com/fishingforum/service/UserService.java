package com.fishingforum.service;

import com.fishingforum.entity.User;
import com.fishingforum.exception.NotFoundException;
import com.fishingforum.repository.UserRepository;
import com.fishingforum.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public User getById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("User not found"));
    }

    public User getByUsername(String username) {
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new NotFoundException("User not found"));
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal)) {
            throw new NotFoundException("User not found");
        }
        return ((UserPrincipal) authentication.getPrincipal()).getUser();
    }
}
