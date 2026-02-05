using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PGFinder2.Data;
using PGFinder2.Models;
using PGFinder2.DTOs;
using Razorpay.Api;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Linq;
using System;

namespace PGFinder2.Controllers
{
using System.Security.Cryptography;
using System.Text;

using PGFinder2.Services;
using Microsoft.EntityFrameworkCore;

    [ApiController]
    [Route("api/payments")]
    [Authorize]
    public class PaymentController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;

        public PaymentController(AppDbContext context, IConfiguration configuration, IEmailService emailService)
        {
            _context = context;
            _configuration = configuration;
            _emailService = emailService;
        }

        [HttpPost("create-order/{bookingId}")]
        public IActionResult CreateOrder(int bookingId)
        {
            try 
            {
                var booking = _context.Bookings.FirstOrDefault(b => b.BookingId == bookingId);
                if (booking == null) return NotFound("Booking not found");

                string keyId = _configuration["Razorpay:KeyId"];
                string keySecret = _configuration["Razorpay:KeySecret"];

                if (string.IsNullOrEmpty(keyId) || string.IsNullOrEmpty(keySecret))
                {
                    return StatusCode(500, "Razorpay keys not configured");
                }

                RazorpayClient client = new RazorpayClient(keyId, keySecret);

                // Ensure amount is at least 1 INR (100 paise)
                decimal amountInRupees = booking.FinalAmount > 0 ? booking.FinalAmount : 5000;
                long amountInPaise = (long)(amountInRupees * 100);

                Dictionary<string, object> options = new Dictionary<string, object>();
                options.Add("amount", amountInPaise); 
                options.Add("currency", "INR");
                options.Add("receipt", "order_rcptid_" + bookingId);
                options.Add("payment_capture", 1); 

                Order order = client.Order.Create(options);
                string orderId = order["id"].ToString();

                return Ok(new 
                { 
                    orderId = orderId, 
                    keyId = keyId, 
                    amount = amountInPaise,
                    currency = "INR",
                    bookingId = bookingId,
                    name = "PG Finder",
                    description = "Monthly Rent Payment" 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error creating order: " + ex.Message);
            }
        }

        [HttpPost("verify")]
        public async Task<IActionResult> VerifyPayment([FromBody] PaymentCaptureDTO dto)
        {
            try
            {
                string keySecret = _configuration["Razorpay:KeySecret"];

                // Manual Verification using HMAC SHA256
                string payload = dto.RazorpayOrderId + "|" + dto.RazorpayPaymentId;
                
                using (var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(keySecret)))
                {
                    var hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(payload));
                    var generatedSignature = BitConverter.ToString(hashBytes).Replace("-", "").ToLower();

                    if (generatedSignature != dto.RazorpaySignature)
                    {
                        return BadRequest(new { message = "Invalid Payment Signature" });
                    }
                }

                // Signature is valid, update DB
                var booking = await _context.Bookings
                    .Include(b => b.User)
                    .Include(b => b.PG)
                    .FirstOrDefaultAsync(b => b.BookingId == dto.BookingId);

                if (booking != null)
                {
                    if (booking.Status == "Confirmed") 
                    {
                        return Ok(new { message = "Payment already processed" });
                    }

                    booking.Status = "Confirmed";
                    
                    var payment = new PGFinder2.Models.Payment
                    {
                        BookingId = booking.BookingId,
                        Amount = booking.FinalAmount > 0 ? booking.FinalAmount : 5000,
                        PaymentStatus = "Success",
                        TransactionId = dto.RazorpayPaymentId
                    };
                    _context.Payments.Add(payment);
                    await _context.SaveChangesAsync();
                    
                    // Send Email Notification
                    if (booking.User != null && !string.IsNullOrEmpty(booking.User.Email))
                    {
                        string subject = $"PGFinder - Booking Confirmed (Booking #{booking.BookingId})";
                        string message = $@"
                        <h3>Booking Confirmed!</h3>
                        <p>Dear {booking.User.FullName},</p>
                        <p>Your booking for <b>{booking.PG?.Name}</b> has been validated and confirmed.</p>
                        <p><b>Amount Paid:</b> ₹{payment.Amount}</p>
                        <p><b>Transaction ID:</b> {payment.TransactionId}</p>
                        <p>Thank you for choosing PG Finder!</p>";

                        try 
                        {
                            await _emailService.SendEmailAsync(booking.User.Email, subject, message);
                        }
                        catch(Exception emailEx)
                        {
                            Console.WriteLine($"Failed to send email: {emailEx.Message}");
                            // Don't fail the request if email fails
                        }
                    }
                }
                else
                {
                    return NotFound(new { message = "Booking not found for verification" });
                }

                return Ok(new { message = "Payment verified successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Payment verification failed: " + ex.Message });
            }
        }
    }
}
