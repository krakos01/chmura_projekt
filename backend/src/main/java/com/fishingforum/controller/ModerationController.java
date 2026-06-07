package com.fishingforum.controller;

import com.fishingforum.dto.ModerationRequest;
import com.fishingforum.entity.ModerationAction;
import com.fishingforum.service.ModerationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/mod")
@RequiredArgsConstructor
public class ModerationController {
    private final ModerationService moderationService;

    @PostMapping("/actions")
    @PreAuthorize("hasAnyRole('MOD','ADMIN')")
    public ResponseEntity<ModerationAction> apply(@RequestBody ModerationRequest request) {
        return ResponseEntity.ok(moderationService.apply(request));
    }
}
