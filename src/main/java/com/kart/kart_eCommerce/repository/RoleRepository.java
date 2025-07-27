package com.kart.kart_eCommerce.repository;

import com.kart.kart_eCommerce.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role , Long> {
    Role findByName(String userRole);
}
