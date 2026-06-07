package com.fishingforum.controller;

import com.fishingforum.dto.PostRequest;
import com.fishingforum.dto.PostResponse;
import com.fishingforum.service.PostService;
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
public class PostController {
    private final PostService postService;

    @GetMapping("/threads/{threadId}/posts")
    public ResponseEntity<List<PostResponse>> listByThread(@PathVariable Long threadId) {
        return ResponseEntity.ok(postService.listByThread(threadId));
    }

    @PostMapping("/posts")
    public ResponseEntity<PostResponse> create(@Valid @RequestBody PostRequest request) {
        return ResponseEntity.ok(postService.create(request));
    }
}
