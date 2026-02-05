// Controllers/PGController.cs
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
    public class PGController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PGController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllPGs([FromQuery] string? city, [FromQuery] string? area, [FromQuery] decimal? maxRent)
        {
            var query = _context.PGs.Include(p => p.Owner).AsQueryable();

            if (!string.IsNullOrEmpty(city))
                query = query.Where(p => p.City.Contains(city));
            if (!string.IsNullOrEmpty(area))
                query = query.Where(p => p.Area.Contains(area));
            if (maxRent.HasValue)
                query = query.Where(p => p.Rent <= maxRent.Value);

            var pgs = await query.Select(p => new
            {
                p.PGId,
                p.Name,
                p.Address,
                p.City,
                p.Area,
                p.State,
                p.Rent,
                p.AvailableRooms,
                p.AvailableSlots,
                p.TotalRooms,
                p.GenderAllowed,
                p.PGType,
                p.Description,
                p.Capacity,
                p.Latitude,
                p.Longitude,
               
          
                Images = p.Images.Select(i => i.ImageUrl).ToList(),
                Videos = p.Videos.Select(v => v.VideoUrl).ToList(),
                Owner = new { p.Owner.FullName, p.Owner.Phone, p.Owner.Email }
            }).ToListAsync();
            
            return Ok(pgs);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPG(int id)
        {
            var pg = await _context.PGs
                .Where(p => p.PGId == id)
                .Select(p => new
                {
                    p.PGId,
                    p.Name,
                    p.Address,
                    p.City,
                    p.Area,
                    p.State,
                    p.Pincode,
                    p.Rent,
                    p.AvailableRooms,
                    p.AvailableSlots,
                    p.TotalRooms,
                    p.GenderAllowed,
                    p.PGType,
                    p.Description,
                    p.Capacity,
                    p.Latitude,
                    p.Longitude,
                    p.IsActive,
                    Images = p.Images.Select(i => i.ImageUrl).ToList(),
                    Videos = p.Videos.Select(v => v.VideoUrl).ToList(),
                    Owner = new
                    {
                        p.Owner.UserId,
                        p.Owner.FullName,
                        p.Owner.Phone,
                        p.Owner.Email
                    }
                })
                .FirstOrDefaultAsync();

            if (pg == null) return NotFound();

            return Ok(pg);
        }

        [HttpPost]
        [Authorize(Roles = "Owner,Admin")]
        public async Task<IActionResult> CreatePG([FromBody] CreatePGDTO dto)
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
                TotalRooms = dto.Capacity, // Assuming TotalRooms roughly equates to Capacity for now
                AvailableRooms = dto.AvailableSlots, // Syncing these for now
                IsActive = true,
                OwnerId = userId
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
            return CreatedAtAction(nameof(GetPG), new { id = pg.PGId }, pg);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Owner,Admin")]
        public async Task<IActionResult> UpdatePG(int id, [FromBody] UpdatePGDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingPG = await _context.PGs
                .Include(p => p.Images)
                .Include(p => p.Videos)
                .FirstOrDefaultAsync(p => p.PGId == id);
            if (existingPG == null) return NotFound();

            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            
            var userId = int.Parse(userIdClaim);
            var userRole = User.FindFirstValue(ClaimTypes.Role);

            if (existingPG.OwnerId != userId && userRole != "Admin")
                return Forbid();

            existingPG.Name = dto.Name;
            existingPG.Address = dto.Address;
            existingPG.Rent = dto.Rent;
            existingPG.GenderAllowed = dto.GenderAllowed;
            existingPG.Latitude = dto.Latitude;
            existingPG.Longitude = dto.Longitude;
            existingPG.City = dto.City;
            existingPG.Area = dto.Area;
            existingPG.Description = dto.Description;
            existingPG.Capacity = dto.Capacity;
            existingPG.AvailableSlots = dto.AvailableSlots;
            existingPG.AvailableRooms = dto.AvailableSlots; // Syncing
            // Update images
            existingPG.Images.Clear();
            if (dto.Images != null && dto.Images.Any())
            {
                foreach (var imgUrl in dto.Images)
                {
                    existingPG.Images.Add(new PGImage { ImageUrl = imgUrl });
                }
            }

            // Update videos
            existingPG.Videos.Clear();
            if (dto.Videos != null && dto.Videos.Any())
            {
                foreach (var videoUrl in dto.Videos)
                {
                    existingPG.Videos.Add(new PGVideo { VideoUrl = videoUrl });
                }
            }

            existingPG.IsActive = dto.IsActive;

            await _context.SaveChangesAsync();
            return Ok(existingPG);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Owner,Admin")]
        public async Task<IActionResult> DeletePG(int id)
        {
            var pg = await _context.PGs.FindAsync(id);
            if (pg == null) return NotFound();

            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            
            var userId = int.Parse(userIdClaim);
            var userRole = User.FindFirstValue(ClaimTypes.Role);

            if (pg.OwnerId != userId && userRole != "Admin")
                return Forbid();

            _context.PGs.Remove(pg);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}