package com.kart.SuperKart.controller;

import com.kart.SuperKart.service.order.IOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"})
public class QuickAdminController {

    @Autowired
    private IOrderService orderService;

    @GetMapping("/admin/stats")
    public Map<String, Object> getAdminStats() {
        return Map.of(
            "totalOrders", 0,
            "totalUsers", 0,
            "totalRevenue", 0.0,
            "totalProducts", 0,
            "recentOrders", java.util.List.of(),
            "topProducts", java.util.List.of(),
            "message", "Backend is running successfully!"
        );
    }

    @GetMapping("/admin/orders")
    public Map<String, Object> getAllOrders() {
        var orders = orderService.getAllOrders();
        Map<String, Object> response = new HashMap<>();
        response.put("content", orders);
        response.put("totalElements", orders.size());
        response.put("totalPages", 1); // Pagination can be added later
        response.put("message", "Orders fetched successfully");
        return response;
    }

    @PatchMapping("/admin/orders/{orderId}/status")
    public Map<String, Object> updateOrderStatus(@PathVariable Long orderId, @RequestParam String status) {
        orderService.updateOrderStatus(orderId, status);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Order status updated successfully");
        return response;
    }
}
