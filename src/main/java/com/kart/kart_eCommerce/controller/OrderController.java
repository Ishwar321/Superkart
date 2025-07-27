package com.kart.kart_eCommerce.controller;

import com.kart.kart_eCommerce.dtos.OrderDto;
import com.kart.kart_eCommerce.model.Order;
import com.kart.kart_eCommerce.response.ApiResponse;
import com.kart.kart_eCommerce.service.order.IOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/orders")
public class OrderController {
    private final IOrderService orderService;

    @PostMapping("/user/{userId}/place-order")
    public ResponseEntity<ApiResponse> placeOrder(@PathVariable Long userId){
        Order order = orderService.placeOrder(userId);
        OrderDto orderDto =  orderService.convertToDto(order);
        return ResponseEntity.ok(new ApiResponse("Order placed successfully!", orderDto));
    }


    @GetMapping("/user/{userId}/orders")
    private ResponseEntity<ApiResponse> getUserOrders(@PathVariable Long userId){
        List<OrderDto> orders = orderService.getUserOrders(userId);
        return ResponseEntity.ok(new ApiResponse("Success!", orders));
    }


}

