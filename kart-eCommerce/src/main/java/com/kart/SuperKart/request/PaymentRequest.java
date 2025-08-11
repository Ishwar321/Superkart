package com.kart.SuperKart.request;

import lombok.Data;

@Data
public class PaymentRequest {
    private int amount;
    private String currency;
}
