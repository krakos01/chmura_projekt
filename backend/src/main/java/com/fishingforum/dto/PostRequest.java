package com.fishingforum.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PostRequest {
    @NotNull
    private Long threadId;

    @NotBlank
    @Size(max = 5000)
    private String content;
}
