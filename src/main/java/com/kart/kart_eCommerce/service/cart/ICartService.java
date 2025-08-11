package com.kart.kart_eCommerce.service.cart;

import com.kart.kart_eCommerce.dtos.CartDto;
import com.kart.kart_eCommerce.model.Cart;
import com.kart.kart_eCommerce.model.User;

import java.math.BigDecimal;

public interface ICartService {
    Cart getCart(Long cartId);
    Cart getCartByUserId(Long userId);
    void clearCart(Long cartId);
    Cart initializeNewCartForUser(User user);
    BigDecimal getTotalPrice(Long cartId);

    CartDto convertToDto(Cart cart);
}
