using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PGFinder2.Data;
using PGFinder2.DTOs;
using PGFinder2.Models;
using System.Security.Claims;

namespace PGFinder2.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReviewController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddReview([FromBody] CreateReviewDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            
            var userId = int.Parse(userIdClaim);

            var review = new Review
            {
                UserId = userId,
                PGId = dto.PGId,
                Rating = dto.Rating,
                Comment = dto.Comment,
                CreatedAt = DateTime.UtcNow
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Review added successfully", review });
        }

        [HttpGet("{pgId}")]
        public IActionResult GetReviews(int pgId)
        {
            var reviews = _context.Reviews.Where(r => r.PGId == pgId).ToList();
            return Ok(reviews);
        }

        [HttpGet("my")]
        [Authorize]
        public IActionResult GetMyReviews()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            
            var userId = int.Parse(userIdClaim);
            var reviews = _context.Reviews.Where(r => r.UserId == userId).ToList();
            return Ok(reviews);
        }
    }
}

