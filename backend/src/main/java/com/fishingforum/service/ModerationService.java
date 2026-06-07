package com.fishingforum.service;

import com.fishingforum.dto.ModerationRequest;
import com.fishingforum.entity.ModerationAction;
import com.fishingforum.entity.ModerationActionType;
import com.fishingforum.entity.Post;
import com.fishingforum.entity.PostStatus;
import com.fishingforum.entity.ThreadStatus;
import com.fishingforum.entity.User;
import com.fishingforum.entity.UserStatus;
import com.fishingforum.exception.NotFoundException;
import com.fishingforum.repository.ModerationActionRepository;
import com.fishingforum.repository.ThreadRepository;
import com.fishingforum.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class ModerationService {
    private final ModerationActionRepository moderationActionRepository;
    private final UserRepository userRepository;
    private final ThreadRepository threadRepository;
    private final PostService postService;
    private final UserService userService;

    @Transactional
    public ModerationAction apply(ModerationRequest request) {
        User moderator = userService.getCurrentUser();
        ModerationActionType type = request.getActionType();

        User targetUser = null;
        if (request.getTargetUserId() != null) {
            targetUser = userRepository.findById(request.getTargetUserId())
                .orElseThrow(() -> new NotFoundException("User not found"));
        }

        Post targetPost = null;
        if (request.getTargetPostId() != null) {
            targetPost = postService.getEntity(request.getTargetPostId());
        }

        if (type == ModerationActionType.BAN_USER && targetUser != null) {
            targetUser.setStatus(UserStatus.BANNED);
            targetUser.setBannedUntil(request.getBanUntil());
            userRepository.save(targetUser);
        }

        if (type == ModerationActionType.HIDE_POST && targetPost != null) {
            targetPost.setStatus(PostStatus.HIDDEN);
            postService.save(targetPost);
        }

        if (type == ModerationActionType.DELETE_POST && targetPost != null) {
            targetPost.setStatus(PostStatus.DELETED);
            postService.save(targetPost);
        }

        var targetThread = request.getTargetThreadId() != null
            ? threadRepository.findById(request.getTargetThreadId())
                .orElseThrow(() -> new NotFoundException("Thread not found"))
            : null;

        if (targetThread != null) {
            if (type == ModerationActionType.LOCK_THREAD) {
                targetThread.setStatus(ThreadStatus.LOCKED);
            } else if (type == ModerationActionType.UNLOCK_THREAD) {
                targetThread.setStatus(ThreadStatus.OPEN);
            }
            targetThread.setUpdatedAt(OffsetDateTime.now());
            threadRepository.save(targetThread);
        }

        ModerationAction action = ModerationAction.builder()
            .actionType(type)
            .moderator(moderator)
            .targetUser(targetUser)
            .targetPost(targetPost)
            .reason(request.getReason())
            .createdAt(OffsetDateTime.now())
            .build();

        action.setTargetThread(targetThread);

        return moderationActionRepository.save(action);
    }
}
