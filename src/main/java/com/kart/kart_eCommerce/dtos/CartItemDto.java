package com.kart.kart_eCommerce.dtos;

import lombok.Data;

@Data
public class CartItemDto {
    private Long id;
    private int quantity;
    private Double unitPrice;
    private ProductDto product;
}
