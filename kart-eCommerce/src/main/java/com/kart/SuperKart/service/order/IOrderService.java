package com.kart.SuperKart.service.order;

import com.kart.SuperKart.dtos.OrderDto;
import com.kart.SuperKart.model.Order;
import com.kart.SuperKart.request.PaymentRequest;
import com.stripe.exception.StripeException;

import java.util.List;
import java.util.Map;

public interface IOrderService {
    Order placeOrder(Long userId);
    List<OrderDto> getUserOrders(Long userId);
    public String createPaymentIntent(PaymentRequest request) throws StripeException;
    OrderDto convertToDto(Order order);
    List<OrderDto> getOrdersByUserId(Long userId);
    List<OrderDto> getAllOrders();
    void updateOrderStatus(Long orderId, String status);
}
