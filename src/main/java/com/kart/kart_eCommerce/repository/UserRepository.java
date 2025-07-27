package com.kart.kart_eCommerce.repository;

import com.kart.kart_eCommerce.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long>{
    boolean existsByEmail(String email);

    User findByEmail(String email);
}
