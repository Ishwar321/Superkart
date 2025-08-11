package com.kart.kart_eCommerce.controller;

import com.kart.kart_eCommerce.dtos.CartDto;
import com.kart.kart_eCommerce.model.Cart;
import com.kart.kart_eCommerce.model.User;
import com.kart.kart_eCommerce.response.ApiResponse;
import com.kart.kart_eCommerce.service.cart.ICartService;
import com.kart.kart_eCommerce.service.user.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/carts")
public class CartController {

    private final ICartService cartService;
    private final IUserService userService;


    @GetMapping("/user/{userId}/cart")
    public ResponseEntity<ApiResponse> getUserCart(@PathVariable Long userId) {
        Cart cart = cartService.getCartByUserId(userId);

        if (cart == null) {

            User user = userService.getUserById(userId);
            cart = cartService.initializeNewCartForUser(user);
        }

        CartDto cartDto = cartService.convertToDto(cart);
        return ResponseEntity.ok(new ApiResponse("Cart retrieved successfully", cartDto));
    }


    @DeleteMapping("/cart/{cartId}/clear")
    public ResponseEntity<ApiResponse> clearCart(@PathVariable Long cartId) {
        cartService.clearCart(cartId);
        return ResponseEntity.ok(new ApiResponse("Cart cleared successfully", null));
    }
}
