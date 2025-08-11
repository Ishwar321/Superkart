package com.kart.kart_eCommerce.dtos;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;


@Data
public class CartDto {
    private Long cartId;
    private Set<CartItemDto> items;
    private BigDecimal totalAmount;
}
