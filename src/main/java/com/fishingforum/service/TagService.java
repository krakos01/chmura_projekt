package com.fishingforum.service;

import com.fishingforum.dto.TagResponse;
import com.fishingforum.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TagService {
    private final TagRepository tagRepository;

    @Transactional(readOnly = true)
    public List<TagResponse> list() {
        return tagRepository.findAll().stream()
            .map(tag -> new TagResponse(tag.getId(), tag.getName()))
            .toList();
    }
}
