package com.kart.SuperKart.service.cart;

import com.kart.SuperKart.dtos.CartDto;
import com.kart.SuperKart.model.Cart;
import com.kart.SuperKart.model.User;

import java.math.BigDecimal;

public interface ICartService {
    Cart getCart(Long cartId);
    Cart getCartByUserId(Long userId);
    void clearCart(Long cartId);
    Cart initializeNewCartForUser(User user);
    BigDecimal getTotalPrice(Long cartId);

    CartDto convertToDto(Cart cart);
}
