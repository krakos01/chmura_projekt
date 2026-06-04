package com.fishingforum.controller;

import com.fishingforum.dto.SearchResultDto;
import com.fishingforum.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {
    private final SearchService searchService;

    @GetMapping
    public ResponseEntity<SearchResultDto> search(@RequestParam("q") String query) {
        return ResponseEntity.ok(searchService.search(query));
    }
}
