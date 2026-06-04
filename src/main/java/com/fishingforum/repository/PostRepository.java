package com.fishingforum.repository;

import com.fishingforum.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByThreadId(Long threadId);
    List<Post> findByContentContainingIgnoreCase(String query);
}
