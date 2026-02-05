using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PGFinder2.Data;
using PGFinder2.DTOs;
using PGFinder2.Models;
using System.Security.Claims;

//namespace PGFinder.API.Controllers;
namespace PGFinder2.Controllers;
[ApiController]
[Route("api/bookings")]
[Authorize]
public class BookingController : ControllerBase
{
    private readonly AppDbContext _context;

    public BookingController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public IActionResult CreateBooking(BookingDTO dto)
    {
        var email = User.FindFirst(ClaimTypes.Email)?.Value;
        var user = _context.Users.FirstOrDefault(x => x.Email == email);
        
        var pg = _context.PGs.FirstOrDefault(p => p.PGId == dto.PGId);
        if (pg == null) return NotFound("PG Not Found");

        var booking = new Booking
        {
            UserId = user.UserId,
            PGId = dto.PGId,
            TotalAmount = pg.Rent,
            FinalAmount = pg.Rent,
            DiscountAmount = 0,
            Status = "Pending",
            BookingDate = DateTime.UtcNow
        };

        _context.Bookings.Add(booking);
        _context.SaveChanges();

        // Load PG details into the booking object for the response, or project it
        // Re-saving likely unnecessary but we want the DTO
        
        return Ok(new
        {
            booking.BookingId,
            booking.UserId,
            booking.PGId,
            booking.BookingDate,
            booking.Status,
            booking.DiscountAmount,
            booking.TotalAmount,
            booking.FinalAmount,
            booking.CheckInDate,
            booking.CheckOutDate,
            PGName = pg.Name,
            PGAddress = pg.Address,
            PGCity = pg.City,
            Rent = pg.Rent,
            Amount = booking.FinalAmount
        });
    }

    [HttpGet("my")]
    public IActionResult MyBookings()
    {
        var email = User.FindFirst(ClaimTypes.Email)?.Value;
        var user = _context.Users.FirstOrDefault(x => x.Email == email);

        var bookings = _context.Bookings
            .Include(b => b.PG)
            .Where(b => b.UserId == user.UserId)
            .Select(b => new
            {
                b.BookingId,
                b.UserId,
                b.PGId,
                b.BookingDate,
                b.Status,
                b.DiscountAmount,
                b.TotalAmount,
                b.FinalAmount,
                b.CheckInDate,
                b.CheckOutDate,
                PGName = b.PG.Name,
                PGAddress = b.PG.Address
            })
            .ToList();

        return Ok(bookings);
    }
    
    [HttpGet("{id}")]
    public IActionResult GetBooking(int id)
    {
        var email = User.FindFirst(ClaimTypes.Email)?.Value;
        var user = _context.Users.FirstOrDefault(x => x.Email == email);

        var booking = _context.Bookings
            .Include(b => b.PG)
            .FirstOrDefault(b => b.BookingId == id && b.UserId == user.UserId);

        if (booking == null) return NotFound();

        return Ok(new {
             booking.BookingId,
            booking.UserId,
            booking.PGId,
            booking.BookingDate,
            booking.Status,
            booking.DiscountAmount,
            booking.TotalAmount,
            booking.FinalAmount,
            booking.CheckInDate,
            booking.CheckOutDate,
            PGName = booking.PG.Name,
            PGAddress = booking.PG.Address,
            PGCity = booking.PG.City,
            Rent = booking.PG.Rent,
            Amount = booking.FinalAmount
        });
    }
}
