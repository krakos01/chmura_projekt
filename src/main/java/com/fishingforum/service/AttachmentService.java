package com.fishingforum.service;

import com.fishingforum.dto.AttachmentResponse;
import com.fishingforum.entity.Attachment;
import com.fishingforum.entity.Post;
import com.fishingforum.exception.NotFoundException;
import com.fishingforum.repository.AttachmentRepository;
import com.fishingforum.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AttachmentService {
    private final AttachmentRepository attachmentRepository;
    private final PostRepository postRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    public AttachmentResponse upload(Long postId, MultipartFile file) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new NotFoundException("Post not found"));

        String filename = UUID.randomUUID() + "-" + file.getOriginalFilename();
        Path target = Paths.get(uploadDir).resolve(filename);

        try {
            Files.createDirectories(target.getParent());
            Files.write(target, file.getBytes());
        } catch (IOException ex) {
            throw new IllegalArgumentException("Failed to store file");
        }

        Attachment attachment = Attachment.builder()
            .post(post)
            .url("/uploads/" + filename)
            .filename(file.getOriginalFilename())
            .contentType(file.getContentType() == null ? "application/octet-stream" : file.getContentType())
            .size(file.getSize())
            .createdAt(OffsetDateTime.now())
            .build();

        attachmentRepository.save(attachment);
        return toResponse(attachment);
    }

    @Transactional(readOnly = true)
    public List<AttachmentResponse> listByPost(Long postId) {
        return attachmentRepository.findByPostId(postId).stream()
            .map(this::toResponse)
            .toList();
    }

    private AttachmentResponse toResponse(Attachment attachment) {
        return new AttachmentResponse(
            attachment.getId(),
            attachment.getPost().getId(),
            attachment.getUrl(),
            attachment.getFilename(),
            attachment.getContentType(),
            attachment.getSize(),
            attachment.getCreatedAt()
        );
    }
}
