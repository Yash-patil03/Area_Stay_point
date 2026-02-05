using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PGFinder2.Data;
using PGFinder2.Models;

namespace PGFinder2.Controllers;
[ApiController]
[Route("api/discounts")]
[Authorize]
public class DiscountController : ControllerBase
{
    private readonly AppDbContext _context;

    public DiscountController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public IActionResult RequestDiscount(DiscountRequest request)
    {
        _context.DiscountRequests.Add(request);
        _context.SaveChanges();
        return Ok("Discount request submitted");
    }
    [HttpGet("pending")]
    public IActionResult GetPendingRequests()
    {
        // Donors should see all pending requests
        var requests = _context.DiscountRequests
            .Include(r => r.User)
            .Include(r => r.PG)
            .Where(r => r.Status == "Pending")
            .OrderByDescending(r => r.RequestId)
            .ToList();
        return Ok(requests);
    }
    
    [HttpGet("history")]
    public IActionResult GetHistory()
    {
        var requests = _context.DiscountRequests
            .Include(r => r.User)
            .Include(r => r.PG)
            .Where(r => r.Status != "Pending")
            .OrderByDescending(r => r.RequestId)
            .ToList();
        return Ok(requests);
    }

    [HttpPost("{id}/approve")]
    public IActionResult ApproveRequest(int id, [FromBody] PGFinder2.DTOs.DiscountApprovalDTO dto)
    {
        var request = _context.DiscountRequests.Find(id);
        if (request == null) return NotFound("Request not found");

        if (request.Status != "Pending") return BadRequest("Request is not pending");

        request.Status = "Approved";
        request.DiscountPercent = dto.ApprovedPercent; // Update with the actual approved percent

        var booking = _context.Bookings
            .Where(b => b.UserId == request.UserId && b.PGId == request.PGId && b.Status == "Pending")
            .OrderByDescending(b => b.BookingId)
            .FirstOrDefault();

        Console.WriteLine($"[ApproveRequest] RequestID: {id}, UserID: {request.UserId}, PGID: {request.PGId}");
        
        if (booking != null)
        {
            Console.WriteLine($"[ApproveRequest] Found Booking ID: {booking.BookingId}, TotalAmount: {booking.TotalAmount}, Percent: {request.DiscountPercent}");
            
            // Apply discount based on DONOR'S approved percent
            decimal discountValue = (booking.TotalAmount * request.DiscountPercent) / 100;
            booking.DiscountAmount = discountValue;
            booking.FinalAmount = booking.TotalAmount - discountValue;
            
            Console.WriteLine($"[ApproveRequest] Calculated Discount: {discountValue}, New Final: {booking.FinalAmount}");
        }
        else
        {
            Console.WriteLine("[ApproveRequest] WARNING: No Pending Booking Found!");
        }
        _context.SaveChanges();
        return Ok("Discount approved and applied to booking");
    }

    [HttpPost("{id}/reject")]
    public IActionResult RejectRequest(int id)
    {
        var request = _context.DiscountRequests.Find(id);
        if (request == null) return NotFound("Request not found");

        request.Status = "Rejected";
        _context.SaveChanges();
        return Ok("Request rejected");
    }
}
