package com.fishingforum.service;

import com.fishingforum.dto.CategoryRequest;
import com.fishingforum.dto.CategoryResponse;
import com.fishingforum.entity.Category;
import com.fishingforum.exception.NotFoundException;
import com.fishingforum.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<CategoryResponse> list() {
        return categoryRepository.findAllByOrderByPositionAsc().stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public CategoryResponse get(Long id) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Category not found"));
        return toResponse(category);
    }

    public CategoryResponse create(CategoryRequest request) {
        Category category = Category.builder()
            .name(request.getName())
            .description(request.getDescription())
            .position(request.getPosition())
            .createdAt(OffsetDateTime.now())
            .build();
        return toResponse(categoryRepository.save(category));
    }

    private CategoryResponse toResponse(Category category) {
        return new CategoryResponse(category.getId(), category.getName(), category.getDescription(), category.getPosition());
    }
}
