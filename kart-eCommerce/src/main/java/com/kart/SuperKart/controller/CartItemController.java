    package com.kart.SuperKart.controller;
    
    import com.kart.SuperKart.dtos.CartItemDto;
    import com.kart.SuperKart.model.Cart;
    import com.kart.SuperKart.model.CartItem;
    import com.kart.SuperKart.model.User;
    import com.kart.SuperKart.response.ApiResponse;
    import com.kart.SuperKart.service.cart.ICartItemService;
    import com.kart.SuperKart.service.cart.ICartService;
    import com.kart.SuperKart.service.user.IUserService;
    import lombok.RequiredArgsConstructor;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;


    @RestController
    @RequiredArgsConstructor
    @RequestMapping("${api.prefix}/cartItems")
    public class CartItemController {
        private final ICartItemService cartItemService;
        private final IUserService userService;
        private final ICartService cartService;

    @PostMapping("/item/add")
    public ResponseEntity<ApiResponse> addItemToCart(@RequestParam Long productId, @RequestParam int quantity) {
        try {
            User user = userService.getAuthenticatedUser();
            Cart cart = cartService.initializeNewCartForUser(user);
            CartItem cartItem = cartItemService.addItemToCart(cart.getId(), productId, quantity);
            CartItemDto cartItemDto = cartItemService.convertToDto(cartItem);
            return ResponseEntity.ok(new ApiResponse("Item added successfully!", cartItemDto));
        } catch (Exception e) {
            System.err.println("Error adding item to cart: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new ApiResponse("Error adding item to cart: " + e.getMessage(), null));
        }
    }        @DeleteMapping("/cart/{cartId}/item/{itemId}/remove")
        public ResponseEntity<ApiResponse> removeItemFromCart(@PathVariable Long cartId,
                                                              @PathVariable Long itemId) {
            cartItemService.removeItemFromCart(cartId, itemId);
            return ResponseEntity.ok(new ApiResponse("Item removed successfully!", null));
        }

        @PutMapping("/cart/{cartId}/item/{itemId}/update")
        public ResponseEntity<ApiResponse> updateCartItem(@PathVariable Long cartId,
                                                          @PathVariable Long itemId,
                                                          @RequestParam int quantity) {

            cartItemService.updateItemQuantity(cartId, itemId, quantity);
            return ResponseEntity.ok(new ApiResponse("Item updated successfully!", null));
        }
    }
