package com.fishingforum.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@AllArgsConstructor
public class AttachmentResponse {
    private Long id;
    private Long postId;
    private String url;
    private String filename;
    private String contentType;
    private Long size;
    private OffsetDateTime createdAt;
}
