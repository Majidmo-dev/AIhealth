package com.afyaai.backend.doctor;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "doctors")
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false) private String name;
    @Column(nullable = false) private String specialty;
    @Column(nullable = false) private String clinic;
    @Column(nullable = false) private String rating;
    @Column(nullable = false) private String hours;

    public Doctor() {}

    public Doctor(String name, String specialty, String clinic, String rating, String hours) {
        this.name = name;
        this.specialty = specialty;
        this.clinic = clinic;
        this.rating = rating;
        this.hours = hours;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getSpecialty() { return specialty; }
    public String getClinic() { return clinic; }
    public String getRating() { return rating; }
    public String getHours() { return hours; }

    public void setName(String name) { this.name = name; }
    public void setSpecialty(String specialty) { this.specialty = specialty; }
    public void setClinic(String clinic) { this.clinic = clinic; }
    public void setRating(String rating) { this.rating = rating; }
    public void setHours(String hours) { this.hours = hours; }
}
