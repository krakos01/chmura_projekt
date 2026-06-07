package com.fishingforum.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.Set;

@Data
@AllArgsConstructor
public class ThreadResponse {
    private Long id;
    private String title;
    private Long categoryId;
    private String author;
    private String status;
    private Set<String> tags;
    private OffsetDateTime createdAt;
}
