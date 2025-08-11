package com.kart.SuperKart.repository;

import com.kart.SuperKart.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role , Long> {
    Role findByName(String userRole);
}
