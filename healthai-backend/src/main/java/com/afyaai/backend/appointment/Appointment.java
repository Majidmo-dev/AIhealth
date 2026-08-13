package com.afyaai.backend.appointment;

import java.time.Instant;
import java.util.UUID;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "appointments")
public class Appointment {
    @Id
    private String id;

    @Column(nullable = false) private Long doctorId;
    @Column private String doctor;
    @Column private String specialty;
    @Column(nullable = false) private String date;
    @Column(nullable = false) private String time;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Column(nullable = false) private Instant createdAt;

    public enum Status { Requested, Confirmed, Cancelled }

    public Appointment() {}

    @PrePersist
    void assignDefaults() {
        if (id == null) id = UUID.randomUUID().toString();
        if (status == null) status = Status.Requested;
        if (createdAt == null) createdAt = Instant.now();
    }

    public String getId() { return id; }
    public Long getDoctorId() { return doctorId; }
    public String getDoctor() { return doctor; }
    public String getSpecialty() { return specialty; }
    public String getDate() { return date; }
    public String getTime() { return time; }
    public Status getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }

    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
    public void setDoctor(String doctor) { this.doctor = doctor; }
    public void setSpecialty(String specialty) { this.specialty = specialty; }
    public void setDate(String date) { this.date = date; }
    public void setTime(String time) { this.time = time; }
    public void setStatus(Status status) { this.status = status; }
}
