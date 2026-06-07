package com.fishingforum.repository;

import com.fishingforum.entity.ModerationAction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ModerationActionRepository extends JpaRepository<ModerationAction, Long> {
}
