package com.fishingforum.service;

import com.fishingforum.dto.PostResponse;
import com.fishingforum.dto.SearchResultDto;
import com.fishingforum.dto.ThreadResponse;
import com.fishingforum.repository.PostRepository;
import com.fishingforum.repository.ThreadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchService {
    private final ThreadRepository threadRepository;
    private final PostRepository postRepository;
    private final ThreadService threadService;
    private final PostService postService;

    @Transactional(readOnly = true)
    public SearchResultDto search(String query) {
        List<ThreadResponse> threads = threadRepository.findByTitleContainingIgnoreCase(query).stream()
            .map(threadService::toResponse)
            .toList();
        List<PostResponse> posts = postRepository.findByContentContainingIgnoreCase(query).stream()
            .map(postService::toResponse)
            .toList();
        return new SearchResultDto(threads, posts);
    }
}
