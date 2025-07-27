    package com.kart.kart_eCommerce.controller;
    
    import com.kart.kart_eCommerce.dtos.CartItemDto;
    import com.kart.kart_eCommerce.model.Cart;
    import com.kart.kart_eCommerce.model.CartItem;
    import com.kart.kart_eCommerce.model.User;
    import com.kart.kart_eCommerce.response.ApiResponse;
    import com.kart.kart_eCommerce.service.cart.ICartItemService;
    import com.kart.kart_eCommerce.service.cart.ICartService;
    import com.kart.kart_eCommerce.service.user.IUserService;
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
            User user = userService.getAuthenticatedUser();
            Cart cart = cartService.initializeNewCartForUser(user);
            CartItem cartItem = cartItemService.addItemToCart(cart.getId(), productId, quantity);
            CartItemDto cartItemDto = cartItemService.convertToDto(cartItem);
            return ResponseEntity.ok(new ApiResponse("Item added successfully!", cartItemDto));
        }

        @DeleteMapping("/cart/{cartId}/item/{itemId}/remove")
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
