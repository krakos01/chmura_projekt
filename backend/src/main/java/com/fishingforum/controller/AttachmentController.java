package com.fishingforum.controller;

import com.fishingforum.dto.AttachmentResponse;
import com.fishingforum.service.AttachmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AttachmentController {
    private final AttachmentService attachmentService;

    @PostMapping("/posts/{postId}/attachments")
    public ResponseEntity<AttachmentResponse> upload(@PathVariable Long postId, @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(attachmentService.upload(postId, file));
    }

    @GetMapping("/posts/{postId}/attachments")
    public ResponseEntity<List<AttachmentResponse>> listByPost(@PathVariable Long postId) {
        return ResponseEntity.ok(attachmentService.listByPost(postId));
    }
}
