package com.afyaai.backend.appointment;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentRepository extends JpaRepository<Appointment, String> {
    List<Appointment> findAllByOrderByCreatedAtDesc();
}
