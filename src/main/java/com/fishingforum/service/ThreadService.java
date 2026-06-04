package com.fishingforum.service;

import com.fishingforum.dto.ThreadRequest;
import com.fishingforum.dto.ThreadResponse;
import com.fishingforum.entity.Category;
import com.fishingforum.entity.ForumThread;
import com.fishingforum.entity.Tag;
import com.fishingforum.entity.ThreadStatus;
import com.fishingforum.entity.User;
import com.fishingforum.exception.NotFoundException;
import com.fishingforum.repository.CategoryRepository;
import com.fishingforum.repository.TagRepository;
import com.fishingforum.repository.ThreadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ThreadService {
    private final ThreadRepository threadRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final UserService userService;

    @Transactional(readOnly = true)
    public List<ThreadResponse> listByCategory(Long categoryId) {
        return threadRepository.findByCategoryId(categoryId).stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public ThreadResponse get(Long id) {
        ForumThread thread = threadRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Thread not found"));
        return toResponse(thread);
    }

    public ThreadResponse create(ThreadRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
            .orElseThrow(() -> new NotFoundException("Category not found"));
        User author = userService.getCurrentUser();

        ForumThread thread = ForumThread.builder()
            .title(request.getTitle())
            .category(category)
            .author(author)
            .status(ThreadStatus.OPEN)
            .createdAt(OffsetDateTime.now())
            .updatedAt(OffsetDateTime.now())
            .build();

        if (request.getTagNames() != null && !request.getTagNames().isEmpty()) {
            Set<Tag> tags = new HashSet<>();
            for (String name : request.getTagNames()) {
                Tag tag = tagRepository.findByNameIgnoreCase(name)
                    .orElseGet(() -> tagRepository.save(Tag.builder().name(name).build()));
                tags.add(tag);
            }
            thread.setTags(tags);
        }

        return toResponse(threadRepository.save(thread));
    }

    public ThreadResponse toResponse(ForumThread thread) {
        Set<String> tags = thread.getTags().stream().map(Tag::getName).collect(java.util.stream.Collectors.toSet());
        return new ThreadResponse(thread.getId(), thread.getTitle(), thread.getCategory().getId(),
            thread.getAuthor().getUsername(), thread.getStatus().name(), tags, thread.getCreatedAt());
    }
}
