package com.fishingforum.controller;

import com.fishingforum.dto.ThreadRequest;
import com.fishingforum.dto.ThreadResponse;
import com.fishingforum.service.ThreadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ThreadController {
    private final ThreadService threadService;

    @GetMapping("/categories/{categoryId}/threads")
    public ResponseEntity<List<ThreadResponse>> listByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(threadService.listByCategory(categoryId));
    }

    @GetMapping("/threads/{id}")
    public ResponseEntity<ThreadResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(threadService.get(id));
    }

    @PostMapping("/threads")
    public ResponseEntity<ThreadResponse> create(@Valid @RequestBody ThreadRequest request) {
        return ResponseEntity.ok(threadService.create(request));
    }
}
