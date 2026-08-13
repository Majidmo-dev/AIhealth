package com.afyaai.backend.config;

import java.util.List;
import com.afyaai.backend.clinic.Clinic;
import com.afyaai.backend.clinic.ClinicRepository;
import com.afyaai.backend.doctor.Doctor;
import com.afyaai.backend.doctor.DoctorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {
    private final DoctorRepository doctors;
    private final ClinicRepository clinics;

    public DataSeeder(DoctorRepository doctors, ClinicRepository clinics) {
        this.doctors = doctors;
        this.clinics = clinics;
    }

    @Override
    public void run(String... args) {
        if (doctors.count() == 0) {
            doctors.saveAll(List.of(
                    new Doctor("Dr. Amina Salim", "General Medicine", "Mwanakwerekwe Health Centre", "4.9", "09:00–16:00"),
                    new Doctor("Dr. Hassan Omar", "Internal Medicine", "Zanzibar Medical Center", "4.8", "10:00–17:00"),
                    new Doctor("Dr. Fatma Ali", "Pediatrics", "Mnazi Mmoja Hospital", "4.9", "08:00–15:00")
            ));
        }
        if (clinics.count() == 0) {
            clinics.saveAll(List.of(
                    new Clinic("Zanzibar Medical Center", 1.2, "Open now", "Private clinic", "Vuga, Zanzibar", "+255 24 223 3322"),
                    new Clinic("Mwanakwerekwe Health Centre", 2.8, "Open now", "Health centre", "Mwanakwerekwe, Zanzibar", "+255 24 223 1111"),
                    new Clinic("Mnazi Mmoja Hospital", 4.1, "Open 24 hours", "Hospital", "Mkunazini, Zanzibar", "+255 24 223 4000")
            ));
        }
    }
}
