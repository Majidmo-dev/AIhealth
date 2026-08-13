package com.afyaai.backend.clinic;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "clinics")
public class Clinic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false) private String name;
    @Column(nullable = false) private Double distance;
    @Column(name = "open_status", nullable = false) private String open;
    @Column(nullable = false) private String type;
    @Column(nullable = false) private String address;
    @Column(nullable = false) private String phone;

    public Clinic() {}

    public Clinic(String name, Double distance, String open, String type, String address, String phone) {
        this.name = name;
        this.distance = distance;
        this.open = open;
        this.type = type;
        this.address = address;
        this.phone = phone;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public Double getDistance() { return distance; }
    public String getOpen() { return open; }
    public String getType() { return type; }
    public String getAddress() { return address; }
    public String getPhone() { return phone; }

    public void setName(String name) { this.name = name; }
    public void setDistance(Double distance) { this.distance = distance; }
    public void setOpen(String open) { this.open = open; }
    public void setType(String type) { this.type = type; }
    public void setAddress(String address) { this.address = address; }
    public void setPhone(String phone) { this.phone = phone; }
}
