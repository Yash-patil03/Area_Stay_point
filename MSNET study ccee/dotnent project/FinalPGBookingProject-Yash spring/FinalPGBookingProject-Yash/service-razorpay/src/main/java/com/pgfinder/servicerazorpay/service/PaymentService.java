package com.pgfinder.servicerazorpay.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    public String debugKeys() {
        String safeSecret = (keySecret != null && keySecret.length() > 4) ? keySecret.substring(0, 4) + "****"
                : "null/short";
        return "Key ID: " + keyId + " | Secret: " + safeSecret;
    }

    @jakarta.annotation.PostConstruct
    public void init() {
        System.out.println("============================================");
        System.out.println("RAZORPAY SERVICE STARTED");
        System.out.println("Loaded Key ID: " + keyId);
        System.out.println("Loaded Secret: " + (keySecret != null ? keySecret.substring(0, 4) + "****" : "null"));
        System.out.println("============================================");
    }

    public String createOrder(int amount) throws RazorpayException {
        if (keyId == null || keySecret == null || keyId.isEmpty() || keySecret.isEmpty()) {
            throw new RuntimeException("CRITICAL: Razorpay keys are not configured in application.properties");
        }

        try {
            RazorpayClient client = new RazorpayClient(keyId, keySecret);
            JSONObject options = new JSONObject();
            options.put("amount", (int) (amount * 100)); // amount in paise
            options.put("currency", "INR");
            options.put("receipt", "txn_" + System.currentTimeMillis());

            System.out.println("DEBUG: Using Razorpay Key: " + keyId);
            System.out.println("DEBUG: Using Razorpay Secret (first 4 chars): "
                    + (keySecret != null && keySecret.length() > 4 ? keySecret.substring(0, 4) : "null/short"));
            System.out.println("Creating real Razorpay order for amount: " + amount);
            Order order = client.orders.create(options);
            return order.get("id").toString();
        } catch (RazorpayException e) {
            System.err.println("Razorpay Error: " + e.getMessage());
            throw e;
        }
    }
}
