package com.afyaai.backend.chat;

import java.time.Instant;

public record ChatMessage(String id, String from, String text, Instant createdAt) {}
