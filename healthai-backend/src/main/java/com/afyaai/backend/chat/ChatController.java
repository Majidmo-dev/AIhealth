package com.afyaai.backend.chat;

import java.time.Instant;
import java.util.UUID;
import java.util.regex.Pattern;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/chat")
public class ChatController {
    private static final Pattern EMERGENCY =
            Pattern.compile("chest pain|breath|bleeding|faint|seizure", Pattern.CASE_INSENSITIVE);

    private static final String URGENT_REPLY =
            "This may be urgent. Call local emergency services or go to the nearest emergency department now.";
    private static final String GENERAL_REPLY =
            "I can provide general health information, but I cannot diagnose conditions. "
                    + "If symptoms are severe, worsening, or persistent, please contact a qualified clinician.";

    @PostMapping("/messages")
    public ChatMessage reply(@Valid @RequestBody ChatRequest request) {
        String text = EMERGENCY.matcher(request.message()).find() ? URGENT_REPLY : GENERAL_REPLY;
        return new ChatMessage(UUID.randomUUID().toString(), "ai", text, Instant.now());
    }
}
