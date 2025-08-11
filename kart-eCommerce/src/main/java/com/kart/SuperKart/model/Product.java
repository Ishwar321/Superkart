package com.kart.SuperKart.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String brand;
    private BigDecimal price;
    private BigDecimal originalPrice; // Original price before discount
    private Integer discountPercentage; // Discount percentage (0-100)
    private boolean isOnSale; // Whether the product is currently on sale
    private int inventory;
    private String description;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Image> images;

    public Product(String name, String brand, BigDecimal price, int inventory, String description, Category category) {
        this.name = name;
        this.brand = brand;
        this.price = price;
        this.originalPrice = price; // Set original price same as price initially
        this.discountPercentage = 0; // No discount initially
        this.isOnSale = false; // Not on sale initially
        this.inventory = inventory;
        this.description = description;
        this.category = category;
    }

    // Helper method to calculate discounted price
    public BigDecimal getDiscountedPrice() {
        if (isOnSale && discountPercentage != null && discountPercentage > 0) {
            BigDecimal discount = originalPrice.multiply(BigDecimal.valueOf(discountPercentage)).divide(BigDecimal.valueOf(100));
            return originalPrice.subtract(discount);
        }
        return price;
    }

    // Helper method to get savings amount
    public BigDecimal getSavingsAmount() {
        if (isOnSale && discountPercentage != null && discountPercentage > 0) {
            return originalPrice.subtract(getDiscountedPrice());
        }
        return BigDecimal.ZERO;
    }

    // Convenience method for getting the first image URL
    public String getImageUrl() {
        if (images != null && !images.isEmpty()) {
            return images.get(0).getImageUrl();
        }
        return "/images/placeholder.png"; // Default placeholder
    }
}
