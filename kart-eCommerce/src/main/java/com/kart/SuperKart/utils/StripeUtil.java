package com.kart.SuperKart.utils;

import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
@Setter
public class StripeUtil {
    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @PostConstruct
    public void inti()
    {
        Stripe.apiKey = stripeSecretKey;
    }

}
