package com.fishingforum.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@AllArgsConstructor
public class PostResponse {
    private Long id;
    private Long threadId;
    private String author;
    private String content;
    private String status;
    private OffsetDateTime createdAt;
}
