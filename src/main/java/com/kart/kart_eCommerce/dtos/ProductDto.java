package com.kart.kart_eCommerce.dtos;

import com.kart.kart_eCommerce.model.Category;
import com.kart.kart_eCommerce.model.Image;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;


@Data
public class ProductDto {
    private Long id;
    private String name;
    private String brand;
    private BigDecimal price;
    private int inventory;
    private String description;
    private Category category;
    private List<ImageDto> images;
}
