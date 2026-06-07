package com.fishingforum.config;

import com.fishingforum.entity.Category;
import com.fishingforum.entity.ForumThread;
import com.fishingforum.entity.Post;
import com.fishingforum.entity.PostStatus;
import com.fishingforum.entity.Role;
import com.fishingforum.entity.ThreadStatus;
import com.fishingforum.entity.User;
import com.fishingforum.entity.UserStatus;
import com.fishingforum.repository.CategoryRepository;
import com.fishingforum.repository.PostRepository;
import com.fishingforum.repository.ThreadRepository;
import com.fishingforum.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ThreadRepository threadRepository;
    private final PostRepository postRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (categoryRepository.count() > 0) {
            return;
        }

        // Create Users
        User admin = User.builder()
                .username("admin")
                .email("admin@fishnet.com")
                .passwordHash(passwordEncoder.encode("admin123"))
                .status(UserStatus.ACTIVE)
                .createdAt(OffsetDateTime.now())
                .roles(Set.of(Role.ROLE_ADMIN, Role.ROLE_MOD, Role.ROLE_USER))
                .build();
        userRepository.save(admin);

        User user = User.builder()
                .username("angler")
                .email("angler@example.com")
                .passwordHash(passwordEncoder.encode("angler123"))
                .status(UserStatus.ACTIVE)
                .createdAt(OffsetDateTime.now())
                .roles(Set.of(Role.ROLE_USER))
                .build();
        userRepository.save(user);

        // Create Categories
        Category general = Category.builder()
                .name("General Discussion")
                .description("Talk about anything related to fishing.")
                .position(1)
                .createdAt(OffsetDateTime.now())
                .build();
        categoryRepository.save(general);

        Category gear = Category.builder()
                .name("Fishing Gear")
                .description("Rods, reels, lures and more.")
                .position(2)
                .createdAt(OffsetDateTime.now())
                .build();
        categoryRepository.save(gear);

        Category locations = Category.builder()
                .name("Fishing Spots")
                .description("Share your favorite secret spots.")
                .position(3)
                .createdAt(OffsetDateTime.now())
                .build();
        categoryRepository.save(locations);

        // Create Threads and Posts
        createThread(general, admin, "Welcome to FishNet!", "Welcome to our new fishing community!");
        createThread(gear, user, "Best lure for bass?", "What lures are you guys using for early season bass?");
        createThread(locations, admin, "Secret Lake in the Mountains", "I found a great spot last weekend. The trout are biting!");
    }

    private void createThread(Category category, User author, String title, String content) {
        ForumThread thread = ForumThread.builder()
                .title(title)
                .category(category)
                .author(author)
                .status(ThreadStatus.OPEN)
                .createdAt(OffsetDateTime.now())
                .updatedAt(OffsetDateTime.now())
                .build();
        threadRepository.save(thread);

        Post post = Post.builder()
                .thread(thread)
                .author(author)
                .content(content)
                .status(PostStatus.VISIBLE)
                .createdAt(OffsetDateTime.now())
                .updatedAt(OffsetDateTime.now())
                .build();
        postRepository.save(post);
    }
}
