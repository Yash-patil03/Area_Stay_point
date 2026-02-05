// Models/Rating.cs
namespace PGFinder2.Models;
public class Rating
{
    public int RatingId { get; set; }
    public int PGId { get; set; }
    public PG? PG { get; set; }
    public int UserId { get; set; }
    public User? User { get; set; }
    public int Value { get; set; } // 1-5
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}