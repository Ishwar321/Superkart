package com.kart.kart_eCommerce.repository;

import com.kart.kart_eCommerce.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem , Long> {
    List<OrderItem> findByProductId(Long productId);
}
