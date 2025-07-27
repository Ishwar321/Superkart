package com.kart.kart_eCommerce.security.jwt;

public class CustomErrorResponse {
    private String message;

    public CustomErrorResponse(String message) {
        this.message = message;
    }

    // Getter
    public String getMessage() {
        return message;
    }

    // Setter
    public void setMessage(String message) {
        this.message = message;
    }
}
