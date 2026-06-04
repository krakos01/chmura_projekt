package com.fishingforum.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Set;

@Data
public class ThreadRequest {
    @NotBlank
    @Size(max = 200)
    private String title;

    @NotNull
    private Long categoryId;

    private Set<String> tagNames;
}
