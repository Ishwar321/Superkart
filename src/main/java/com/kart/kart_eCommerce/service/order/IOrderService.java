package com.kart.kart_eCommerce.service.order;

import com.kart.kart_eCommerce.dtos.OrderDto;
import com.kart.kart_eCommerce.model.Order;

import java.util.List;

public interface IOrderService {
    Order placeOrder(Long userId);
    List<OrderDto> getUserOrders(Long userId);

    OrderDto convertToDto(Order order);
}
