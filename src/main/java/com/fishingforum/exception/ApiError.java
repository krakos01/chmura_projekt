package com.fishingforum.exception;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@AllArgsConstructor
public class ApiError {
    private String message;
    private OffsetDateTime timestamp;
    private String path;
}
