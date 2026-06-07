package com.fishingforum.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CategoryRequest {
    @NotBlank
    @Size(max = 120)
    private String name;

    @Size(max = 500)
    private String description;

    @NotNull
    private Integer position;
}
