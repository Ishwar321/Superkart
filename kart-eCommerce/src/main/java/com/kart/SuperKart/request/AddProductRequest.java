package com.kart.SuperKart.request;

import com.kart.SuperKart.model.Category;
import lombok.Data;

import java.math.BigDecimal;
@Data
public class AddProductRequest {
    private Long id;
    private String name;
    private String brand;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private Integer discountPercentage;
    private boolean isOnSale;
    private int inventory;
    private String description;
    private Category category;


}
