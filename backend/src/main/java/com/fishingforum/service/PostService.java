package com.fishingforum.service;

import com.fishingforum.dto.PostRequest;
import com.fishingforum.dto.PostResponse;
import com.fishingforum.entity.ForumThread;
import com.fishingforum.entity.Post;
import com.fishingforum.entity.PostStatus;
import com.fishingforum.entity.ThreadStatus;
import com.fishingforum.entity.User;
import com.fishingforum.exception.ForbiddenException;
import com.fishingforum.exception.NotFoundException;
import com.fishingforum.repository.PostRepository;
import com.fishingforum.repository.ThreadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final ThreadRepository threadRepository;
    private final UserService userService;

    @Transactional(readOnly = true)
    public List<PostResponse> listByThread(Long threadId) {
        return postRepository.findByThreadId(threadId).stream()
            .map(this::toResponse)
            .toList();
    }

    public PostResponse create(PostRequest request) {
        ForumThread thread = threadRepository.findById(request.getThreadId())
            .orElseThrow(() -> new NotFoundException("Thread not found"));
        if (thread.getStatus() == ThreadStatus.LOCKED) {
            throw new ForbiddenException("Thread is locked");
        }
        User author = userService.getCurrentUser();

        Post post = Post.builder()
            .thread(thread)
            .author(author)
            .content(request.getContent())
            .status(PostStatus.VISIBLE)
            .createdAt(OffsetDateTime.now())
            .updatedAt(OffsetDateTime.now())
            .build();

        return toResponse(postRepository.save(post));
    }

    @Transactional(readOnly = true)
    public Post getEntity(Long id) {
        return postRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Post not found"));
    }

    public Post save(Post post) {
        return postRepository.save(post);
    }

    public PostResponse toResponse(Post post) {
        return new PostResponse(post.getId(), post.getThread().getId(), post.getAuthor().getUsername(),
            post.getContent(), post.getStatus().name(), post.getCreatedAt());
    }
}
