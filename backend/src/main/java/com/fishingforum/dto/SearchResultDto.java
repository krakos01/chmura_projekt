package com.fishingforum.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class SearchResultDto {
    private List<ThreadResponse> threads;
    private List<PostResponse> posts;
}
