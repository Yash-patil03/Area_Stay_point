// Controllers/OwnerController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PGFinder2.Data;
using PGFinder2.Models;
using PGFinder2.DTOs;
using System.Security.Claims;

namespace PGFinder2.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Owner")]
    public class OwnerController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OwnerController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("pgs")]
        public async Task<IActionResult> GetMyPGs()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            
            var userId = int.Parse(userIdClaim);

            var pgs = await _context.PGs
                .Where(p => p.OwnerId == userId)
                .ToListAsync();

            return Ok(pgs);
        }

       
        [HttpGet("pgs/{id}")]
        public async Task<IActionResult> GetMyPG(int id)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            
            var userId = int.Parse(userIdClaim);

            var pg = await _context.PGs
                .Include(p => p.Images)
                .Include(p => p.Videos)
                .FirstOrDefaultAsync(p => p.PGId == id && p.OwnerId == userId);

            if (pg == null) return NotFound();

            return Ok(pg);
        }

        [HttpPost("pgs")]
        public async Task<IActionResult> AddPG([FromBody] CreatePGDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            
            var userId = int.Parse(userIdClaim);

            var pg = new PG
            {
                Name = dto.Name,
                Address = dto.Address,
                Rent = dto.Rent,
                GenderAllowed = dto.GenderAllowed,
                Latitude = dto.Latitude,
                Longitude = dto.Longitude,
                City = dto.City,
                Area = dto.Area,
                Description = dto.Description,
                Capacity = dto.Capacity,
                AvailableSlots = dto.AvailableSlots,
                TotalRooms = dto.Capacity,
                AvailableRooms = dto.AvailableSlots,
                OwnerId = userId,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            if (dto.Images != null && dto.Images.Any())
            {
                foreach (var imgUrl in dto.Images)
                {
                    pg.Images.Add(new PGImage { ImageUrl = imgUrl });
                }
            }

            if (dto.Videos != null && dto.Videos.Any())
            {
                foreach (var videoUrl in dto.Videos)
                {
                    pg.Videos.Add(new PGVideo { VideoUrl = videoUrl });
                }
            }

            _context.PGs.Add(pg);
            await _context.SaveChangesAsync();

            var result = new
            {
                pg.PGId,
                pg.Name,
                pg.Address,
                pg.City,
                pg.Area,
                pg.Rent,
                pg.Capacity,
                pg.AvailableSlots,
                Images = pg.Images.Select(i => i.ImageUrl).ToList(),
                Videos = pg.Videos.Select(v => v.VideoUrl).ToList(),
                pg.IsActive
            };

            return CreatedAtAction(nameof(GetMyPG), new { id = pg.PGId }, result);
        }

        // Update PG
        [HttpPut("pgs/{id}")]
        public async Task<IActionResult> UpdatePG(int id, [FromBody] UpdatePGDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            
            var userId = int.Parse(userIdClaim);

            var pg = await _context.PGs
                .Include(p => p.Images)
                .Include(p => p.Videos)
                .FirstOrDefaultAsync(p => p.PGId == id && p.OwnerId == userId);
            
            if (pg == null) return NotFound();

            pg.Name = dto.Name;
            pg.Address = dto.Address;
            pg.Rent = dto.Rent;
            pg.GenderAllowed = dto.GenderAllowed;
            pg.Latitude = dto.Latitude;
            pg.Longitude = dto.Longitude;
            pg.City = dto.City;
            pg.Area = dto.Area;
            pg.Description = dto.Description;
            pg.Capacity = dto.Capacity;
            pg.AvailableSlots = dto.AvailableSlots;
            pg.TotalRooms = dto.Capacity;
            pg.AvailableRooms = dto.AvailableSlots;
            pg.IsActive = dto.IsActive;

            // Update images - simpler approach: clear and re-add if provided
            if (dto.Images != null && dto.Images.Any())
            {
                pg.Images.Clear();
                foreach (var imgUrl in dto.Images)
                {
                    pg.Images.Add(new PGImage { ImageUrl = imgUrl });
                }
            }

            // Update videos
            if (dto.Videos != null && dto.Videos.Any())
            {
                pg.Videos.Clear();
                foreach (var videoUrl in dto.Videos)
                {
                    pg.Videos.Add(new PGVideo { VideoUrl = videoUrl });
                }
            }

            await _context.SaveChangesAsync();
            
            var result = new
            {
                pg.PGId,
                pg.Name,
                pg.Address,
                pg.City,
                pg.Area,
                pg.Rent,
                pg.Capacity,
                pg.AvailableSlots,
                Images = pg.Images.Select(i => i.ImageUrl).ToList(),
                Videos = pg.Videos.Select(v => v.VideoUrl).ToList(),
                pg.IsActive
            };

            return Ok(new { message = "PG updated successfully", pg = result });
        }

        // Delete PG
        [HttpDelete("pgs/{id}")]
        public async Task<IActionResult> DeletePG(int id)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            
            var userId = int.Parse(userIdClaim);

            var pg = await _context.PGs
                .FirstOrDefaultAsync(p => p.PGId == id && p.OwnerId == userId);
            
            if (pg == null) return NotFound();

            _context.PGs.Remove(pg);
            await _context.SaveChangesAsync();

            return Ok(new { message = "PG deleted successfully" });
        }

        // Get bookings for owner's PGs
        [HttpGet("bookings")]
        public async Task<IActionResult> GetMyBookings()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            
            var userId = int.Parse(userIdClaim);

            var bookings = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.PG)
                .Where(b => b.PG.OwnerId == userId)
                .Select(b => new
                {
                    b.BookingId,
                    UserName = b.User.FullName,
                    PGName = b.PG.Name,
                    b.BookingDate,
                    b.Status
                })
                .ToListAsync();

            return Ok(bookings);
        }

        // Get statistics for owner
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            
            var userId = int.Parse(userIdClaim);

            var stats = new
            {
                TotalPGs = await _context.PGs.CountAsync(p => p.OwnerId == userId),
                TotalBookings = await _context.Bookings
                    .CountAsync(b => b.PG.OwnerId == userId)
            };

            return Ok(stats);
        }
    }
}