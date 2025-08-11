package com.kart.SuperKart.controller;

import com.kart.SuperKart.dtos.CartDto;
import com.kart.SuperKart.model.Cart;
import com.kart.SuperKart.model.User;
import com.kart.SuperKart.response.ApiResponse;
import com.kart.SuperKart.service.cart.ICartService;
import com.kart.SuperKart.service.user.IUserService;
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
