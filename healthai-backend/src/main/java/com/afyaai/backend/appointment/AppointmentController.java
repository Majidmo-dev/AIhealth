package com.afyaai.backend.appointment;

import java.util.List;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {
    private final AppointmentRepository repository;

    public AppointmentController(AppointmentRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Appointment> list() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping
    public ResponseEntity<Appointment> create(@Valid @RequestBody AppointmentRequestDto body) {
        Appointment appointment = new Appointment();
        appointment.setDoctorId(body.doctorId());
        appointment.setDoctor(body.doctor());
        appointment.setSpecialty(body.specialty());
        appointment.setDate(body.date());
        appointment.setTime(body.time());
        Appointment saved = repository.save(appointment);
        return ResponseEntity.status(201).body(saved);
    }
}
