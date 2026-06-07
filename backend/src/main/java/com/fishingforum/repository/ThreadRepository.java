package com.fishingforum.repository;

import com.fishingforum.entity.ForumThread;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ThreadRepository extends JpaRepository<ForumThread, Long> {
    List<ForumThread> findByCategoryId(Long categoryId);
    List<ForumThread> findByTitleContainingIgnoreCase(String query);
}
