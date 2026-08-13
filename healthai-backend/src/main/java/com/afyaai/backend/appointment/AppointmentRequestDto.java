package com.afyaai.backend.appointment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record AppointmentRequestDto(
        @NotNull Long doctorId,
        String doctor,
        String specialty,
        @NotBlank @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}") String date,
        @NotBlank @Pattern(regexp = "\\d{2}:\\d{2}") String time
) {}
