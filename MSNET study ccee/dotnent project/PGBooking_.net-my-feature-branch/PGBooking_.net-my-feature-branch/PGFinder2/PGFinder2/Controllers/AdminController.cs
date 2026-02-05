// Controllers/AdminController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PGFinder2.Data;
using PGFinder2.DTOs;
using PGFinder2.Models;
using System.Security.Claims;

namespace PGFinder2.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .Include(u => u.Role)
                .Select(u => new
                {
                    u.UserId,
                    u.FullName,
                    u.Email,
                    u.Phone,
                    Role = u.Role.RoleName
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User deleted successfully" });
        }

        [HttpPut("users/{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserUpdateDTO userDto)
        {
            var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.UserId == id);
            if (user == null)
                return NotFound();

            user.FullName = userDto.FullName;
            user.Email = userDto.Email;
            user.Phone = userDto.Phone;

            var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == userDto.Role);
            if (role != null)
            {
                user.RoleId = role.RoleId;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "User updated successfully" });
        }

        // ========== PG MANAGEMENT ==========
        [HttpGet("pgs")]
        public async Task<IActionResult> GetAllPGs()
        {
            var pgs = await _context.PGs
                .Include(p => p.Owner)
                .ToListAsync();

            var result = pgs.Select(p => new
            {
                p.PGId,
                p.Name,
                p.Address,
                p.City,
                p.Area,
                p.Rent,
                p.TotalRooms,
                p.AvailableRooms,
                p.Gender,
                p.IsActive,
                p.CreatedAt,
                OwnerName = p.Owner?.FullName ?? "",
                OwnerEmail = p.Owner?.Email ?? ""
            }).ToList();

            return Ok(result);
        }

        [HttpGet("pgs/{id}")]
        public async Task<IActionResult> GetPG(int id)
        {
            var pg = await _context.PGs
                .Include(p => p.Owner)
                .FirstOrDefaultAsync(p => p.PGId == id);

            if (pg == null) return NotFound();

            return Ok(pg);
        }

        [HttpPost("pgs")]
        public async Task<IActionResult> CreatePG([FromBody] PG pg)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            pg.CreatedAt = DateTime.UtcNow;
            pg.IsActive = true;

            _context.PGs.Add(pg);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPG), new { id = pg.PGId }, pg);
        }

        [HttpPut("pgs/{id}")]
        public async Task<IActionResult> UpdatePG(int id, [FromBody] PG pgData)
        {
            var pg = await _context.PGs.FindAsync(id);
            if (pg == null) return NotFound();

            pg.Name = pgData.Name;
            pg.Address = pgData.Address;
            pg.Description = pgData.Description;
            pg.City = pgData.City;
            pg.Area = pgData.Area;
            pg.Rent = pgData.Rent;
            pg.TotalRooms = pgData.TotalRooms;
            pg.AvailableRooms = pgData.AvailableRooms;
            pg.Gender = pgData.Gender;
            pg.Latitude = pgData.Latitude;
            pg.Longitude = pgData.Longitude;
            pg.IsActive = pgData.IsActive;

            await _context.SaveChangesAsync();
            return Ok(pg);
        }

        [HttpDelete("pgs/{id}")]
        public async Task<IActionResult> DeletePG(int id)
        {
            var pg = await _context.PGs.FindAsync(id);
            if (pg == null) return NotFound();

            _context.PGs.Remove(pg);
            await _context.SaveChangesAsync();

            return Ok(new { message = "PG deleted successfully" });
        }

        // ========== BOOKING MANAGEMENT WITH USER & PAYMENT INFO ==========
        [HttpGet("bookings")]
        public async Task<IActionResult> GetAllBookings()
        {
            var bookings = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.PG)
                .Select(b => new
                {
                    b.BookingId,
                    User = new
                    {
                        b.User.UserId,
                        b.User.FullName,
                        b.User.Email,
                        b.User.Phone
                    },
                    PG = new
                    {
                        b.PG.PGId,
                        b.PG.Name,
                        b.PG.Address
                    },
                    b.CheckInDate,
                    b.CheckOutDate,
                    b.TotalAmount,
                    b.DiscountAmount,
                    b.FinalAmount,
                    b.Status,
                    b.BookingDate
                })
                .ToListAsync();

            return Ok(bookings);
        }

        [HttpGet("donations")]
        public async Task<IActionResult> GetAllDonations()
        {
            var donations = await _context.Donations
                .Include(d => d.Donor)
                .Select(d => new
                {
                    d.DonationId,
                    DonorName = d.Donor.FullName,
                    d.Amount,
                    d.DonationDate
                })
                .ToListAsync();

            return Ok(donations);
        }

        [HttpGet("reviews")]
        public async Task<IActionResult> GetAllReviews()
        {
            var reviews = await _context.Reviews
                .Select(r => new
                {
                    r.ReviewId,
                    r.UserId,
                    r.PGId,
                    r.Rating,
                    r.Comment,
                    r.CreatedAt
                })
                .ToListAsync();

            return Ok(reviews);
        }

        // ========== PAYMENTS & STATS ==========
        [HttpGet("payments")]
        public async Task<IActionResult> GetAllPayments()
        {
            var payments = await _context.Payments
                .Include(p => p.Booking)
                    .ThenInclude(b => b.User)
                .Include(p => p.Booking)
                    .ThenInclude(b => b.PG)
                .Select(p => new
                {
                    p.PaymentId,
                    p.Amount,
                    p.PaymentStatus,
                    p.TransactionId,
                    Booking = new
                    {
                        p.Booking.BookingId,
                        User = new
                        {
                            p.Booking.User.FullName,
                            p.Booking.User.Email
                        },
                        PG = new
                        {
                            p.Booking.PG.Name
                        }
                    }
                })
                .ToListAsync();

            return Ok(payments);
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var totalUsers = await _context.Users.CountAsync();
            var totalPGs = await _context.PGs.CountAsync();
            var totalBookings = await _context.Bookings.CountAsync();
            var totalRevenue = await _context.Payments
                .Where(p => p.PaymentStatus == "Success")
                .SumAsync(p => p.Amount);

            return Ok(new
            {
                TotalUsers = totalUsers,
                TotalPGs = totalPGs,
                TotalBookings = totalBookings,
                TotalRevenue = totalRevenue
            });
        }
    }
}