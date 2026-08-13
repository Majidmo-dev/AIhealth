package com.afyaai.backend.clinic;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/clinics")
public class ClinicController {
    private final ClinicRepository repository;

    public ClinicController(ClinicRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Clinic> list() {
        return repository.findAll();
    }
}
