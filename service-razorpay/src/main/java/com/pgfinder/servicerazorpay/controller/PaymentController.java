package com.pgfinder.servicerazorpay.controller;

import com.pgfinder.servicerazorpay.service.PaymentService;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*") // Allow requests from any frontend
@RequestMapping("/api/payment")
public class PaymentController {

    private PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping("/health")
    public String healthCheck() {
        return "Razorpay Service is Up";
    }

    @GetMapping("/verify-config")
    public String verifyConfig() {
        try {
            // Retrieve keys via reflection or just create a temporary order to test
            // For safety, we will just return what the service has loaded
            return paymentService.debugKeys(); // method we will add to Service
        } catch (Exception e) {
            return "Error sending debug info: " + e.getMessage();
        }
    }

    @PostMapping("/create-order")
    public org.springframework.http.ResponseEntity<?> createOrder(@RequestParam int amount) {
        System.out.println("Received order request for amount: " + amount);
        try {
            String orderId = paymentService.createOrder(amount);
            return org.springframework.http.ResponseEntity.ok(orderId);
        } catch (com.razorpay.RazorpayException e) {
            System.err.println("Razorpay Error: " + e.getMessage());
            return org.springframework.http.ResponseEntity
                    .status(org.springframework.http.HttpStatus.BAD_REQUEST)
                    .body("Razorpay Error: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("General Error: " + e.getMessage());
            return org.springframework.http.ResponseEntity
                    .status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Order creation failed: " + e.getMessage());
        }
    }
}
