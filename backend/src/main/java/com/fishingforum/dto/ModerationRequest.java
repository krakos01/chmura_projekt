package com.fishingforum.dto;

import com.fishingforum.entity.ModerationActionType;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class ModerationRequest {
    private ModerationActionType actionType;
    private Long targetUserId;
    private Long targetThreadId;
    private Long targetPostId;
    private String reason;
    private OffsetDateTime banUntil;
}
